"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { AssignmentType } from "@prisma/client";
import { slugSchema } from "@/lib/content/slug";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { requireUser } from "@/lib/auth/dal";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { DEFAULT_PASS_SCORE, emptyAssignmentBody, fromAssignmentForm, type AssignmentForm, validateRubric } from "@/lib/content/assignment-form";

export type AssignState = { ok?: string; errors?: string[]; id?: string } | undefined;

const str = (max: number) => z.string().max(max);
const FormShape = z.object({
  title: str(120), passScore: z.coerce.number(), status: z.enum(["PUBLISHED", "DRAFT"]),
  purpose: str(3000), scenario: str(3000), requirements: str(10000), recommended: str(10000), steps: str(10000),
  deliverables: str(5000), readmeChecklist: str(5000), resubmitCondition: str(3000), interviewPoints: str(5000),
});

export async function updateAssignment(id: string, raw: AssignmentForm, rubricId: string): Promise<AssignState> {
  const user = await requireUser(ADMIN_ROLES);
  const assignment = await db.assignment.findUniqueOrThrow({ where: { id: z.cuid().parse(id) } });
  const r = fromAssignmentForm(FormShape.parse(raw));
  if (!r.ok) return { errors: r.errors };
  const rubric = await db.rubric.findUnique({ where: { id: z.cuid().parse(rubricId) } });
  if (!rubric) return { errors: ["ルーブリックを選択してください"] };
  await db.assignment.update({ where: { id: assignment.id }, data: { title: r.title, passScore: r.passScore, status: r.status, body: r.body, rubricId: rubric.id } });
  await audit({
    actorId: user.id, action: "assignment.update", targetType: "assignment", targetId: assignment.id,
    metadata: { passScore: { from: assignment.passScore, to: r.passScore }, rubricChanged: rubric.id !== assignment.rubricId },
  });
  revalidatePath("/admin/content/assignments");
  revalidatePath(`/assignments/${assignment.slug}`);
  return { ok: "課題を保存しました。合格点・ルーブリックの変更は、これからの採点に使われます (過去の採点は採点時の内容のまま残ります)。" };
}

const NewAssignment = z.object({
  moduleId: z.cuid(),
  lessonId: z.union([z.cuid(), z.literal("")]),
  title: z.string().trim().min(1, "タイトルを入力してください").max(120),
  slug: slugSchema("a2-grade-calculator"),
  type: z.enum(AssignmentType),
});

/** 課題を下書きとして作る。本文を入力して「公開」にするまで受講生には表示されない */
export async function createAssignment(_prev: AssignState, formData: FormData): Promise<AssignState> {
  const user = await requireUser(ADMIN_ROLES);
  const p = NewAssignment.safeParse(Object.fromEntries(["moduleId", "lessonId", "title", "slug", "type"].map((k) => [k, formData.get(k) ?? ""])));
  if (!p.success) return { errors: p.error.issues.map((i) => i.message) };
  if (await db.assignment.findUnique({ where: { slug: p.data.slug } })) return { errors: ["この URL 名はすでに使われています"] };
  const rubric = await db.rubric.findFirst({ orderBy: { createdAt: "asc" } });
  if (!rubric) return { errors: ["ルーブリックがありません"] };
  const last = await db.assignment.findFirst({ orderBy: { position: "desc" } });
  const created = await db.assignment.create({
    data: {
      slug: p.data.slug, moduleId: p.data.moduleId, lessonId: p.data.lessonId || null, title: p.data.title, type: p.data.type,
      status: "DRAFT", passScore: DEFAULT_PASS_SCORE, rubricId: rubric.id, position: (last?.position ?? -1) + 1,
      body: emptyAssignmentBody(),
    },
  });
  await audit({ actorId: user.id, action: "assignment.create", targetType: "assignment", targetId: created.id });
  revalidatePath("/admin/content/assignments");
  return { ok: "課題を作成しました。", id: created.id };
}

const Criteria = z.array(z.object({ key: str(50), label: str(50), weight: z.coerce.number(), description: str(500) })).max(15);

export async function updateRubric(id: string, name: string, rawCriteria: unknown): Promise<AssignState> {
  const user = await requireUser(ADMIN_ROLES);
  const rubric = await db.rubric.findUniqueOrThrow({ where: { id: z.cuid().parse(id) } });
  const n = z.string().trim().min(1).max(80).safeParse(name);
  if (!n.success) return { errors: ["ルーブリックの名前を入力してください"] };
  const v = validateRubric(Criteria.parse(rawCriteria));
  if (!v.ok) return { errors: v.errors };
  await db.rubric.update({ where: { id: rubric.id }, data: { name: n.data, criteria: v.criteria } });
  await audit({ actorId: user.id, action: "rubric.update", targetType: "rubric", targetId: rubric.id });
  revalidatePath("/admin/content/assignments");
  return { ok: "ルーブリックを保存しました。過去の採点は、採点した時点の観点と配点のまま残ります。" };
}

/** 既存のルーブリックを複製して新しいルーブリックを作る */
export async function duplicateRubric(id: string): Promise<AssignState> {
  const user = await requireUser(ADMIN_ROLES);
  const src = await db.rubric.findUniqueOrThrow({ where: { id: z.cuid().parse(id) } });
  const copy = await db.rubric.create({ data: { name: `${src.name} (コピー)`, criteria: src.criteria as object } });
  await audit({ actorId: user.id, action: "rubric.create", targetType: "rubric", targetId: copy.id, metadata: { from: src.id } });
  revalidatePath("/admin/content/assignments");
  return { ok: "複製しました。", id: copy.id };
}
