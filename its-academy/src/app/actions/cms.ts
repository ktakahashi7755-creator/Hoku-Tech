"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { requireUser } from "@/lib/auth/dal";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { CODE_LANGUAGES, LessonContentSchema } from "@/lib/content/schema";
import { editorStateOf, emptyDraft, fromEditorDraft, type EditorDraft } from "@/lib/content/draft";
import { isEditableDraft } from "@/lib/content/versions";
import { shapeErrors } from "@/lib/form-state";
import { isMissingReference, isUniqueViolation } from "@/lib/db-errors";
import { slugSchema } from "@/lib/content/slug";
import { parseJstLocal } from "@/lib/progress/metrics";

const Id = z.cuid();

/** 下書きの形だけを検証する (内容の必須チェックは公開時)。長さの上限で巨大な入力を防ぐ */
const str = (max: number) => z.string().max(max);
const DraftShape = z.object({
  title: str(120),
  estimatedMinutes: z.coerce.number(),
  changeNote: str(500),
  videoUrl: str(500),
  objectives: str(5000),
  prerequisites: str(5000),
  reviewPoints: str(5000),
  explanation: z.array(z.object({ heading: str(200), body: str(20000) })).max(30),
  examples: z.array(z.object({ title: str(200), body: str(20000) })).max(30),
  code: z
    .array(
      z.object({
        language: z.enum(CODE_LANGUAGES),
        filename: str(200),
        source: str(50000),
        output: str(20000),
        verifiedBy: str(300).optional(),
      }),
    )
    .max(20),
  exercises: z.array(z.object({ title: str(200), task: str(10000), hint: str(5000), answer: str(20000) })).max(20),
  quiz: z.object({
    passScore: z.coerce.number().int().min(0).max(100),
    questions: z.array(z.object({ question: str(1000), choices: str(3000), answerIndex: z.coerce.number().int().min(0), explanation: str(3000) })).max(30),
  }),
  workplaceUse: str(10000),
  commonErrors: z.array(z.object({ error: str(500), cause: str(3000), fix: str(3000) })).max(30),
});

type Tx = Prisma.TransactionClient;

/**
 * 版の保存・確定・公開を、同じレッスンへの同時操作と衝突しない形で実行する。
 * 直列化可能 (Serializable) のトランザクションで行い、衝突したときは数回やり直す
 * (公開直前の版を、別の画面からの下書き保存が上書きするのを防ぐ)。
 */
async function serially<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await db.$transaction(fn, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (e) {
      if (attempt < 3 && e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2034") continue;
      throw e;
    }
  }
}

function revalidateLesson(lessonId: string, slug?: string) {
  revalidatePath("/admin/content");
  revalidatePath(`/admin/content/lessons/${lessonId}`);
  revalidatePath("/curriculum");
  if (slug) revalidatePath(`/lessons/${slug}`);
}

// ---------------------------------------------------------------- 作成・並べ替え

const NewLesson = z.object({
  moduleId: z.cuid(),
  title: z.string().trim().min(1, "タイトルを入力してください").max(120),
  slug: slugSchema("l2-strings"),
});

/** base: 保存した版 (次の保存で、ほかの画面の保存と衝突していないかを確かめる) */
export type CmsState = { error?: string; errors?: string[]; ok?: string; lessonId?: string; base?: EditBase } | undefined;

/**
 * 編集を始めたときの最新の版と、その版を下書きとして保存した日時。
 * ほかの画面が新しい版を作った・同じ下書きを保存した場合は、上書きせずに知らせる (同時編集の確認)。
 * 公開・予約・確定は内容を変えないため、この日時を変えない (自分の公開の後に誤って衝突としない)
 */
export type EditBase = { versionId: string; editedAt: string };

const CONFLICT_MESSAGE =
  "ほかの画面 (または別の人) が、このレッスンを先に保存しました。上書きを防ぐため、保存していません。ページを再読み込みして最新の内容を確認してください (この画面の入力は再読み込みで消えるため、必要な部分はコピーしてください)。";

export async function createLesson(_prev: CmsState, formData: FormData): Promise<CmsState> {
  const user = await requireUser(ADMIN_ROLES);
  const parsed = NewLesson.safeParse({ moduleId: formData.get("moduleId"), title: formData.get("title"), slug: formData.get("slug") });
  if (!parsed.success) return { errors: parsed.error.issues.map((i) => i.message) };
  const { moduleId, title, slug } = parsed.data;
  if (await db.lesson.findUnique({ where: { slug } })) return { errors: ["この URL 名はすでに使われています"] };
  // 本文が未入力の新規レッスンは下書きとして作り、公開には全項目の入力が必要。レッスンと最初の版は一緒に作る
  const blank = emptyDraft(title);
  let lesson;
  try {
    lesson = await db.$transaction(async (tx) => {
      const last = await tx.lesson.findFirst({ where: { moduleId }, orderBy: { position: "desc" } });
      const created = await tx.lesson.create({ data: { moduleId, slug, position: (last?.position ?? -1) + 1, status: "DRAFT" } });
      await tx.lessonVersion.create({
        data: { lessonId: created.id, version: 1, title, estimatedMinutes: blank.estimatedMinutes, content: { editorDraft: blank }, changeNote: "新規作成", authorId: user.id },
      });
      return created;
    });
  } catch (e) {
    if (isUniqueViolation(e)) return { errors: ["同じ URL 名か同じ位置のレッスンが同時に作られました。ページを再読み込みしてからやり直してください。"] };
    if (isMissingReference(e)) return { errors: ["追加先のレベルが見つかりません。ページを再読み込みしてください。"] };
    throw e;
  }
  await audit({ actorId: user.id, action: "lesson.create", targetType: "lesson", targetId: lesson.id });
  revalidatePath("/admin/content");
  return { ok: "レッスンを作成しました。", lessonId: lesson.id };
}

export async function moveLesson(lessonId: string, direction: "up" | "down"): Promise<void> {
  const user = await requireUser(ADMIN_ROLES);
  const lesson = await db.lesson.findUniqueOrThrow({ where: { id: Id.parse(lessonId) } });
  const dir = z.enum(["up", "down"]).parse(direction);
  const neighbor = await db.lesson.findFirst({
    where: { moduleId: lesson.moduleId, position: dir === "up" ? { lt: lesson.position } : { gt: lesson.position } },
    orderBy: { position: dir === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;
  // (moduleId, position) は一意なので、一時的な値を経由して入れ替える
  await db.$transaction([
    db.lesson.update({ where: { id: lesson.id }, data: { position: -1 - lesson.position } }),
    db.lesson.update({ where: { id: neighbor.id }, data: { position: lesson.position } }),
    db.lesson.update({ where: { id: lesson.id }, data: { position: neighbor.position } }),
  ]);
  await audit({ actorId: user.id, action: "lesson.move", targetType: "lesson", targetId: lesson.id, metadata: { direction: dir } });
  revalidateLesson(lesson.id);
}

// ---------------------------------------------------------------- 下書き

/**
 * 下書きを保存する。入力途中でも保存でき、公開に必要な項目の不足は警告として返す。
 * 最新の版が未公開 (下書き) ならそれを上書きし、公開済み・予約済みなら新しい版を作る。
 * 公開済みの版は書き換えない (受講生の進捗・理解度チェックの記録が版に紐づくため)。
 */
export async function saveDraft(lessonId: string, rawDraft: EditorDraft, rawBase?: EditBase): Promise<CmsState> {
  const user = await requireUser(ADMIN_ROLES);
  const id = Id.parse(lessonId);
  const parsedDraft = DraftShape.safeParse(rawDraft);
  if (!parsedDraft.success) return { errors: ["保存できませんでした。入力を短くしてから保存してください。", ...shapeErrors(parsedDraft.error)] };
  const draft = parsedDraft.data;
  const data = {
    title: draft.title.trim() || "(無題)",
    estimatedMinutes: Math.min(Math.max(Math.round(Number(draft.estimatedMinutes)) || 30, 5), 600),
    content: { editorDraft: draft },
    changeNote: draft.changeNote.trim() || null,
    authorId: user.id,
  };
  const base = rawBase ? z.object({ versionId: Id, editedAt: z.iso.datetime() }).safeParse(rawBase) : null;
  const saved = await serially(async (tx) => {
    const lesson = await tx.lesson.findUniqueOrThrow({ where: { id } });
    const latest = await tx.lessonVersion.findFirst({ where: { lessonId: id }, orderBy: { version: "desc" } });
    // 編集を始めた後に、ほかの画面が新しい下書きを作った・同じ下書きを保存した場合は、上書きしない。
    // 編集の元の値は保存されている値をそのまま返したものなので、一致するかだけを見る (時計のずれに左右されない)。
    // 形の合わない値 (古い画面から送られた値など) は、確かめられないので衝突として扱う
    if (base && (!base.success || (latest && (latest.id !== base.data.versionId || latest.editedAt.getTime() !== Date.parse(base.data.editedAt))))) return null;
    const editedAt = nextEditedAt(latest?.editedAt);
    return latest && isEditableDraft(latest, lesson)
      ? tx.lessonVersion.update({ where: { id: latest.id }, data: { ...data, editedAt } })
      : tx.lessonVersion.create({ data: { ...data, editedAt, lessonId: id, version: (latest?.version ?? 0) + 1 } });
  });
  if (!saved) return { error: CONFLICT_MESSAGE };
  await audit({ actorId: user.id, action: "lesson.save_draft", targetType: "lesson", targetId: id, metadata: { version: saved.version } });
  revalidateLesson(id);
  const check = fromEditorDraft(draft);
  return {
    ok: `下書き (版 ${saved.version}) を保存しました。受講生にはまだ表示されません。`,
    errors: check.ok ? undefined : check.errors,
    base: { versionId: saved.id, editedAt: saved.editedAt.toISOString() },
  };
}

/** 保存のたびに必ず変わる「最終編集日時」(同じミリ秒に続けて保存しても、前の値と同じにならない) */
function nextEditedAt(previous: Date | undefined): Date {
  const now = Date.now();
  return new Date(previous && previous.getTime() >= now ? previous.getTime() + 1 : now);
}

/** 過去の版を元に新しい下書きを作る (差し戻し) */
export async function restoreVersionAsDraft(lessonId: string, versionId: string): Promise<void> {
  const user = await requireUser(ADMIN_ROLES);
  const id = Id.parse(lessonId);
  const source = await db.lessonVersion.findFirstOrThrow({ where: { id: Id.parse(versionId), lessonId: id } });
  const editorDraft = { ...editorStateOf(source), changeNote: `版 ${source.version} から復元` };
  const data = { title: source.title, estimatedMinutes: source.estimatedMinutes, content: { editorDraft }, changeNote: editorDraft.changeNote, authorId: user.id };
  await serially(async (tx) => {
    const lesson = await tx.lesson.findUniqueOrThrow({ where: { id } });
    const latest = await tx.lessonVersion.findFirstOrThrow({ where: { lessonId: id }, orderBy: { version: "desc" } });
    const editedAt = nextEditedAt(latest.editedAt);
    if (isEditableDraft(latest, lesson)) await tx.lessonVersion.update({ where: { id: latest.id }, data: { ...data, editedAt } });
    else await tx.lessonVersion.create({ data: { ...data, editedAt, lessonId: id, version: latest.version + 1 } });
  });
  await audit({ actorId: user.id, action: "lesson.restore_version", targetType: "lesson", targetId: id, metadata: { from: source.version } });
  revalidateLesson(id);
}

// ---------------------------------------------------------------- 公開

/**
 * 公開・予約の前に版を確定する。下書き (editorDraft) を検証して LessonContent に変換し、版に書き戻す。
 * 実行検証済みの印は、現在公開中の版とコードが同じ場合だけ引き継ぐ。
 */
async function finalizeVersion(tx: Tx, lessonId: string, versionId: string): Promise<{ error: string } | { version: { id: string; version: number; publishedAt: Date | null }; slug: string }> {
  const version = await tx.lessonVersion.findFirst({
    where: { id: Id.parse(versionId), lessonId: Id.parse(lessonId) },
    include: { lesson: { include: { currentVersion: true } } },
  });
  if (!version) return { error: "版が見つかりません。ページを再読み込みしてください。" };
  if (version.publishedAt) return { version, slug: version.lesson.slug };
  const current = version.lesson.currentVersion ? LessonContentSchema.safeParse(version.lesson.currentVersion.content) : null;
  const result = fromEditorDraft(editorStateOf(version), current?.success ? current.data : null);
  if (!result.ok) return { error: `公開に必要な項目が不足しています: ${result.errors.join(" / ")}` };
  await tx.lessonVersion.update({
    where: { id: version.id },
    data: { title: result.title, estimatedMinutes: result.estimatedMinutes, content: result.content, changeNote: result.changeNote ?? version.changeNote },
  });
  return { version, slug: version.lesson.slug };
}

export async function publishVersion(lessonId: string, versionId: string): Promise<CmsState> {
  const user = await requireUser(ADMIN_ROLES);
  // 確定 (下書き → 教材の形式) と公開を 1 つのトランザクションで行う
  const fin = await serially(async (tx) => {
    const f = await finalizeVersion(tx, lessonId, versionId);
    if ("error" in f) return f;
    await tx.lessonVersion.update({ where: { id: f.version.id }, data: { publishedAt: f.version.publishedAt ?? new Date() } });
    await tx.lesson.update({ where: { id: lessonId }, data: { currentVersionId: f.version.id, status: "PUBLISHED", scheduledVersionId: null, publishAt: null } });
    return f;
  });
  if ("error" in fin) return { error: fin.error };
  const { version } = fin;
  await audit({ actorId: user.id, action: "lesson.publish", targetType: "lesson", targetId: lessonId, metadata: { version: version.version } });
  revalidateLesson(lessonId, fin.slug);
  return { ok: `版 ${version.version} を公開しました。` };
}

const Schedule = z.object({ at: z.iso.datetime({ local: true }) });

export async function scheduleVersion(lessonId: string, versionId: string, atLocal: string): Promise<CmsState> {
  const user = await requireUser(ADMIN_ROLES);
  const parsed = Schedule.safeParse({ at: atLocal });
  if (!parsed.success) return { error: "公開日時を入力してください。" };
  // 入力は日本時間として扱う
  const at = parseJstLocal(parsed.data.at);
  if (at.getTime() <= Date.now()) return { error: "公開日時は現在より後にしてください。" };
  const fin = await serially(async (tx) => {
    const f = await finalizeVersion(tx, lessonId, versionId);
    if ("error" in f) return f;
    if (f.version.publishedAt) return { error: "公開済みの版は予約できません。" };
    await tx.lesson.update({ where: { id: lessonId }, data: { scheduledVersionId: f.version.id, publishAt: at } });
    return f;
  });
  if ("error" in fin) return { error: fin.error };
  const { version } = fin;
  await audit({ actorId: user.id, action: "lesson.schedule", targetType: "lesson", targetId: lessonId, metadata: { version: version.version, at: at.toISOString() } });
  revalidateLesson(lessonId);
  return { ok: "公開を予約しました。" };
}

export async function cancelSchedule(lessonId: string): Promise<void> {
  const user = await requireUser(ADMIN_ROLES);
  await db.lesson.update({ where: { id: Id.parse(lessonId) }, data: { scheduledVersionId: null, publishAt: null } });
  await audit({ actorId: user.id, action: "lesson.schedule_cancel", targetType: "lesson", targetId: lessonId });
  revalidateLesson(lessonId);
}

/** レッスンを公開・非公開にする。非公開にするときは予約公開も取り消す (予約時刻に勝手に公開されないように) */
export async function setLessonStatus(lessonId: string, status: "PUBLISHED" | "DRAFT"): Promise<CmsState> {
  const user = await requireUser(ADMIN_ROLES);
  const id = Id.parse(lessonId);
  const next = z.enum(["PUBLISHED", "DRAFT"]).parse(status);
  const lesson = await db.lesson.findUniqueOrThrow({ where: { id } });
  if (next === "PUBLISHED" && !lesson.currentVersionId) return { error: "公開できる版がありません。先に版を公開してください。" };
  await db.lesson.update({ where: { id }, data: next === "DRAFT" ? { status: next, scheduledVersionId: null, publishAt: null } : { status: next } });
  await audit({ actorId: user.id, action: "lesson.status", targetType: "lesson", targetId: id, metadata: { status: next } });
  revalidateLesson(id, lesson.slug);
  return { ok: next === "DRAFT" ? "非公開にしました。" : "公開しました。" };
}
