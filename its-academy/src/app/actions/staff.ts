"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CommentVisibility, EnrollmentStatus, ReviewDecision, type SubmissionStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { requireUser } from "@/lib/auth/dal";
import { generateTempPassword, hashPassword } from "@/lib/auth/password";
import { ADMIN_ROLES, STAFF_ROLES } from "@/lib/auth/roles";
import { RubricCriteriaSchema } from "@/lib/content/schema";
import { statusFromDecision, totalRubricScore } from "@/lib/progress/metrics";
import { SKILL_AREAS } from "@/lib/progress/skills";
import { assertCanActOnStudent } from "@/lib/queries/student";
import { fieldErrors, type FormState } from "@/lib/form-state";
import { DECISION_LABEL } from "@/lib/labels";
import { isUniqueViolation } from "@/lib/db-errors";

const issues = (e: z.ZodError) => ({ fieldErrors: fieldErrors(e) });

// ---------------------------------------------------------------- レビュー

export async function startReview(submissionId: string): Promise<void> {
  const viewer = await requireUser(STAFF_ROLES);
  const sub = await db.submission.findUniqueOrThrow({ where: { id: z.cuid().parse(submissionId) } });
  await assertCanActOnStudent(viewer, sub.userId);
  // 状態を条件にした更新にして、同時に押されても 1 回だけ記録する
  const started = await db.submission.updateMany({ where: { id: sub.id, status: { in: ["SUBMITTED", "RESUBMITTED"] } }, data: { status: "IN_REVIEW" } });
  if (started.count === 1) await audit({ actorId: viewer.id, action: "review.start", targetType: "submission", targetId: sub.id });
  revalidatePath(`/admin/reviews/${sub.id}`);
}

const ReviewInput = z.object({
  submissionId: z.cuid(),
  decision: z.enum(ReviewDecision),
  comment: z.string().trim().min(10, "受講生が次に何をすればよいか分かるよう、10 文字以上で書いてください").max(5000),
});

export async function submitReview(_prev: FormState, formData: FormData): Promise<FormState> {
  const viewer = await requireUser(STAFF_ROLES);
  const parsed = ReviewInput.safeParse({
    submissionId: formData.get("submissionId"),
    decision: formData.get("decision"),
    comment: formData.get("comment"),
  });
  if (!parsed.success) return issues(parsed.error);
  const input = parsed.data;

  const sub = await db.submission.findUniqueOrThrow({ where: { id: input.submissionId }, include: { assignment: { include: { rubric: true } } } });
  await assertCanActOnStudent(viewer, sub.userId);
  const reviewable: SubmissionStatus[] = ["SUBMITTED", "IN_REVIEW", "RESUBMITTED"];
  if (!reviewable.includes(sub.status)) return { error: "この提出はすでに採点済みです。" };

  const criteria = RubricCriteriaSchema.parse(sub.assignment.rubric.criteria);
  const scores: { key: string; label: string; weight: number; score: number }[] = [];
  for (const c of criteria) {
    const field = formData.get(`score_${c.key}`);
    // 欄がない (採点中にルーブリックが変わった等) ・空欄を 0 点として保存しない
    if (typeof field !== "string" || field.trim() === "") {
      return { fieldErrors: { [`score_${c.key}`]: `0〜${c.weight} の範囲で入力してください` }, error: "採点欄が揃っていません。ページを再読み込みしてから採点してください。" };
    }
    const raw = Number(field);
    if (!Number.isFinite(raw) || raw < 0 || raw > c.weight) {
      return { fieldErrors: { [`score_${c.key}`]: `0〜${c.weight} の範囲で入力してください` } };
    }
    scores.push({ key: c.key, label: c.label, weight: c.weight, score: Math.round(raw) });
  }
  const total = totalRubricScore(scores);
  const passScore = sub.assignment.passScore;
  if (input.decision === "PASS" && total < passScore) {
    return { error: `合計 ${total} 点は合格点 ${passScore} 点に届いていません。修正依頼または不合格を選んでください。` };
  }

  // 2 人が同時に採点しても、先に確定した 1 件だけを保存する (状態を条件にした更新で取り合う)
  const saved = await db.$transaction(async (tx) => {
    const claimed = await tx.submission.updateMany({ where: { id: sub.id, status: { in: reviewable } }, data: { status: statusFromDecision(input.decision) } });
    if (claimed.count !== 1) return false;
    await tx.review.create({
      data: { submissionId: sub.id, reviewerId: viewer.id, scores, totalScore: total, passScore, decision: input.decision, comment: input.comment },
    });
    await tx.notification.create({
      data: {
        userId: sub.userId,
        title: `レビュー結果: ${sub.assignment.title}`,
        body: `${DECISION_LABEL[input.decision]} (${total} 点)。コメントを確認してください。`,
        link: `/assignments/${sub.assignment.slug}`,
      },
    });
    return true;
  });
  if (!saved) return { error: "この提出はほかの講師が採点を確定しました。ページを再読み込みして結果を確認してください。" };
  await audit({ actorId: viewer.id, action: "review.submit", targetType: "submission", targetId: sub.id, metadata: { decision: input.decision, total } });
  revalidatePath(`/admin/reviews/${sub.id}`);
  revalidatePath("/admin/reviews");
  return { ok: "採点を確定しました。受講生に結果を通知しました。" };
}

// ---------------------------------------------------------------- 受講生への記録

const CommentInput = z.object({
  studentId: z.cuid(),
  body: z.string().trim().min(1, "コメントを入力してください").max(5000),
  visibility: z.enum(CommentVisibility),
});

export async function addComment(_prev: FormState, formData: FormData): Promise<FormState> {
  const viewer = await requireUser(STAFF_ROLES);
  const parsed = CommentInput.safeParse({ studentId: formData.get("studentId"), body: formData.get("body"), visibility: formData.get("visibility") });
  if (!parsed.success) return issues(parsed.error);
  await assertCanActOnStudent(viewer, parsed.data.studentId);
  await db.instructorComment.create({ data: { ...parsed.data, authorId: viewer.id } });
  if (parsed.data.visibility === "STUDENT") {
    await db.notification.create({ data: { userId: parsed.data.studentId, title: "講師からコメントが届きました", body: parsed.data.body.slice(0, 120), link: "/reviews" } });
  }
  await audit({ actorId: viewer.id, action: "comment.create", targetType: "user", targetId: parsed.data.studentId, metadata: { visibility: parsed.data.visibility } });
  revalidatePath(`/admin/students/${parsed.data.studentId}`);
  return { ok: "コメントを保存しました。" };
}

const SkillInput = z.object({
  studentId: z.cuid(),
  skill: z.enum(SKILL_AREAS.map((s) => s.key) as [string, ...string[]]),
  level: z.coerce.number().int().min(1).max(5),
  note: z.string().trim().max(1000).optional(),
});

export async function addSkillAssessment(_prev: FormState, formData: FormData): Promise<FormState> {
  const viewer = await requireUser(STAFF_ROLES);
  const parsed = SkillInput.safeParse({
    studentId: formData.get("studentId"),
    skill: formData.get("skill"),
    level: formData.get("level"),
    note: formData.get("note") || undefined,
  });
  if (!parsed.success) return issues(parsed.error);
  await assertCanActOnStudent(viewer, parsed.data.studentId);
  await db.skillAssessment.create({
    data: { userId: parsed.data.studentId, assessorId: viewer.id, skill: parsed.data.skill, level: parsed.data.level, note: parsed.data.note },
  });
  await audit({ actorId: viewer.id, action: "skill.assess", targetType: "user", targetId: parsed.data.studentId, metadata: { skill: parsed.data.skill, level: parsed.data.level } });
  revalidatePath(`/admin/students/${parsed.data.studentId}`);
  return { ok: "スキル評価を記録しました (履歴として残ります)。" };
}

// ---------------------------------------------------------------- 管理者のみ

/** 担当講師に設定できる人か (利用中の講師) */
async function isActiveInstructor(id: string): Promise<boolean> {
  return !!(await db.user.findFirst({ where: { id, role: "INSTRUCTOR", isActive: true }, select: { id: true } }));
}

const EnrollmentInput = z.object({
  enrollmentId: z.cuid(),
  instructorId: z.union([z.cuid(), z.literal("")]),
  targetEndDate: z.union([z.iso.date(), z.literal("")]),
  status: z.enum(EnrollmentStatus),
});

export async function updateEnrollment(_prev: FormState, formData: FormData): Promise<FormState> {
  const viewer = await requireUser(ADMIN_ROLES);
  const parsed = EnrollmentInput.safeParse({
    enrollmentId: formData.get("enrollmentId"),
    instructorId: formData.get("instructorId"),
    targetEndDate: formData.get("targetEndDate"),
    status: formData.get("status"),
  });
  if (!parsed.success) return issues(parsed.error);
  const { enrollmentId, instructorId, targetEndDate, status } = parsed.data;
  if (instructorId) {
    if (!(await isActiveInstructor(instructorId))) return { fieldErrors: { instructorId: "講師を選択してください" } };
  }
  const before = await db.enrollment.findUniqueOrThrow({ where: { id: enrollmentId } });
  await db.enrollment.update({
    where: { id: enrollmentId },
    data: {
      instructorId: instructorId || null,
      targetEndDate: targetEndDate ? new Date(targetEndDate) : null,
      status,
      completedAt: status === "COMPLETED" ? (before.completedAt ?? new Date()) : null,
    },
  });
  await audit({ actorId: viewer.id, action: "enrollment.update", targetType: "enrollment", targetId: enrollmentId, metadata: { instructorId, targetEndDate, status } });
  revalidatePath(`/admin/students/${before.userId}`);
  return { ok: "受講設定を保存しました。" };
}

const NewStudentInput = z.object({
  name: z.string().trim().min(1, "氏名を入力してください").max(100),
  email: z.string().trim().toLowerCase().email("メールアドレスの形式で入力してください").max(254),
  affiliation: z.string().trim().max(100).optional(),
  joinedAt: z.union([z.iso.date(), z.literal("")]),
  instructorId: z.union([z.cuid(), z.literal("")]),
  targetEndDate: z.union([z.iso.date(), z.literal("")]),
});

export type NewStudentState = (NonNullable<FormState> & { tempPassword?: string; email?: string }) | undefined;

/** 受講生を追加する。初期パスワードはこの画面で一度だけ表示し、保存はハッシュのみ */
export async function createStudent(_prev: NewStudentState, formData: FormData): Promise<NewStudentState> {
  const viewer = await requireUser(ADMIN_ROLES);
  const parsed = NewStudentInput.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    affiliation: formData.get("affiliation") || undefined,
    joinedAt: formData.get("joinedAt") ?? "",
    instructorId: formData.get("instructorId") ?? "",
    targetEndDate: formData.get("targetEndDate") ?? "",
  });
  if (!parsed.success) return issues(parsed.error);
  const input = parsed.data;
  if (await db.user.findUnique({ where: { email: input.email } })) return { fieldErrors: { email: "このメールアドレスはすでに登録されています" } };
  if (input.instructorId && !(await isActiveInstructor(input.instructorId))) {
    return { fieldErrors: { instructorId: "講師を選択してください" } };
  }
  const course = await db.course.findFirst({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "asc" } });
  if (!course) return { error: "公開中のコースがありません。先にコースを公開してから受講生を追加してください。" };

  const tempPassword = generateTempPassword();
  let user;
  try {
    user = await db.user.create({
      data: {
        name: input.name,
        email: input.email,
        affiliation: input.affiliation,
        joinedAt: input.joinedAt ? new Date(input.joinedAt) : null,
        passwordHash: await hashPassword(tempPassword),
        mustChangePassword: true, // 初回ログイン時にパスワードの変更を求める
        enrollments: {
          create: {
            courseId: course.id,
            instructorId: input.instructorId || null,
            targetEndDate: input.targetEndDate ? new Date(input.targetEndDate) : null,
          },
        },
      },
    });
  } catch (e) {
    // 同じメールアドレスが同時に登録された場合
    if (isUniqueViolation(e)) return { fieldErrors: { email: "このメールアドレスはすでに登録されています" } };
    throw e;
  }
  await audit({ actorId: viewer.id, action: "user.create", targetType: "user", targetId: user.id, metadata: { role: "STUDENT" } });
  revalidatePath("/admin/students");
  return { ok: "受講生を追加しました。", tempPassword, email: user.email };
}

const SettingsInput = z.object({ stagnationThresholdDays: z.coerce.number().int().min(1, "1 日以上にしてください").max(60, "60 日以下にしてください") });

export async function updateSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  const viewer = await requireUser(ADMIN_ROLES);
  const parsed = SettingsInput.safeParse({ stagnationThresholdDays: formData.get("stagnationThresholdDays") });
  if (!parsed.success) return issues(parsed.error);
  await db.setting.upsert({
    where: { key: "stagnationThresholdDays" },
    create: { key: "stagnationThresholdDays", value: parsed.data.stagnationThresholdDays },
    update: { value: parsed.data.stagnationThresholdDays },
  });
  await audit({ actorId: viewer.id, action: "settings.update", metadata: parsed.data });
  revalidatePath("/admin");
  return { ok: "設定を保存しました。" };
}
