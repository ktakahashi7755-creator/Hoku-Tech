"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { SubmissionStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { requireUser } from "@/lib/auth/dal";
import { hashPassword } from "@/lib/auth/password";
import { ADMIN_ROLES, STAFF_ROLES } from "@/lib/auth/roles";
import { RubricCriteriaSchema } from "@/lib/content/schema";
import { statusFromDecision, totalRubricScore } from "@/lib/progress/metrics";
import { SKILL_AREAS } from "@/lib/progress/skills";
import { assertCanViewStudent } from "@/lib/queries/student";
import type { FormState } from "./auth";

const issues = (e: z.ZodError) => ({ fieldErrors: Object.fromEntries(e.issues.map((i) => [String(i.path[0]), i.message])) });

// ---------------------------------------------------------------- レビュー

export async function startReview(submissionId: string): Promise<void> {
  const viewer = await requireUser(STAFF_ROLES);
  const sub = await db.submission.findUniqueOrThrow({ where: { id: z.cuid().parse(submissionId) } });
  await assertCanViewStudent(viewer, sub.userId);
  if (sub.status === "SUBMITTED" || sub.status === "RESUBMITTED") {
    await db.submission.update({ where: { id: sub.id }, data: { status: "IN_REVIEW" } });
    await audit({ actorId: viewer.id, action: "review.start", targetType: "submission", targetId: sub.id });
  }
  revalidatePath(`/admin/reviews/${sub.id}`);
}

const ReviewInput = z.object({
  submissionId: z.cuid(),
  decision: z.enum(["PASS", "CHANGES_REQUESTED", "FAIL"]),
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
  await assertCanViewStudent(viewer, sub.userId);
  const reviewable: SubmissionStatus[] = ["SUBMITTED", "IN_REVIEW", "RESUBMITTED"];
  if (!reviewable.includes(sub.status)) return { error: "この提出はすでに採点済みです。" };

  const criteria = RubricCriteriaSchema.parse(sub.assignment.rubric.criteria);
  const scores = [];
  for (const c of criteria) {
    const raw = Number(formData.get(`score_${c.key}`));
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

  await db.$transaction([
    db.review.create({
      data: { submissionId: sub.id, reviewerId: viewer.id, scores, totalScore: total, passScore, decision: input.decision, comment: input.comment },
    }),
    db.submission.update({ where: { id: sub.id }, data: { status: statusFromDecision(input.decision) } }),
    db.notification.create({
      data: {
        userId: sub.userId,
        title: `レビュー結果: ${sub.assignment.title}`,
        body: `${{ PASS: "合格", CHANGES_REQUESTED: "修正依頼", FAIL: "不合格" }[input.decision]} (${total} 点)。コメントを確認してください。`,
        link: `/assignments/${sub.assignment.slug}`,
      },
    }),
  ]);
  await audit({ actorId: viewer.id, action: "review.submit", targetType: "submission", targetId: sub.id, metadata: { decision: input.decision, total } });
  revalidatePath(`/admin/reviews/${sub.id}`);
  revalidatePath("/admin/reviews");
  return { ok: "採点を保存しました。受講生に通知しました。" };
}

// ---------------------------------------------------------------- 受講生への記録

const CommentInput = z.object({
  studentId: z.cuid(),
  body: z.string().trim().min(1, "コメントを入力してください").max(5000),
  visibility: z.enum(["INTERNAL", "STUDENT"]),
});

export async function addComment(_prev: FormState, formData: FormData): Promise<FormState> {
  const viewer = await requireUser(STAFF_ROLES);
  const parsed = CommentInput.safeParse({ studentId: formData.get("studentId"), body: formData.get("body"), visibility: formData.get("visibility") });
  if (!parsed.success) return issues(parsed.error);
  await assertCanViewStudent(viewer, parsed.data.studentId);
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
    note: (formData.get("note") as string | null) || undefined,
  });
  if (!parsed.success) return issues(parsed.error);
  await assertCanViewStudent(viewer, parsed.data.studentId);
  await db.skillAssessment.create({
    data: { userId: parsed.data.studentId, assessorId: viewer.id, skill: parsed.data.skill, level: parsed.data.level, note: parsed.data.note },
  });
  await audit({ actorId: viewer.id, action: "skill.assess", targetType: "user", targetId: parsed.data.studentId, metadata: { skill: parsed.data.skill, level: parsed.data.level } });
  revalidatePath(`/admin/students/${parsed.data.studentId}`);
  return { ok: "スキル評価を記録しました (履歴として残ります)。" };
}

// ---------------------------------------------------------------- 管理者のみ

const EnrollmentInput = z.object({
  enrollmentId: z.cuid(),
  instructorId: z.union([z.cuid(), z.literal("")]),
  targetEndDate: z.union([z.iso.date(), z.literal("")]),
  status: z.enum(["ACTIVE", "PAUSED", "COMPLETED", "WITHDRAWN"]),
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
    const ok = await db.user.findFirst({ where: { id: instructorId, role: "INSTRUCTOR", isActive: true } });
    if (!ok) return { fieldErrors: { instructorId: "講師を選択してください" } };
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
  return { ok: "受講設定を更新しました。" };
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
    affiliation: (formData.get("affiliation") as string | null) || undefined,
    joinedAt: formData.get("joinedAt") ?? "",
    instructorId: formData.get("instructorId") ?? "",
    targetEndDate: formData.get("targetEndDate") ?? "",
  });
  if (!parsed.success) return issues(parsed.error);
  const input = parsed.data;
  if (await db.user.findUnique({ where: { email: input.email } })) return { fieldErrors: { email: "このメールアドレスはすでに登録されています" } };
  const course = await db.course.findFirst({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "asc" } });
  if (!course) return { error: "公開中のコースがありません。" };

  const tempPassword = randomBytes(12).toString("base64url");
  const user = await db.user.create({
    data: {
      name: input.name,
      email: input.email,
      affiliation: input.affiliation,
      joinedAt: input.joinedAt ? new Date(input.joinedAt) : null,
      passwordHash: await hashPassword(tempPassword),
      enrollments: {
        create: {
          courseId: course.id,
          instructorId: input.instructorId || null,
          targetEndDate: input.targetEndDate ? new Date(input.targetEndDate) : null,
        },
      },
    },
  });
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

export async function setLessonStatus(lessonId: string, status: "PUBLISHED" | "DRAFT"): Promise<void> {
  const viewer = await requireUser(ADMIN_ROLES);
  const id = z.cuid().parse(lessonId);
  const s = z.enum(["PUBLISHED", "DRAFT"]).parse(status);
  const lesson = await db.lesson.findUniqueOrThrow({ where: { id } });
  if (s === "PUBLISHED" && !lesson.currentVersionId) throw new Error("公開できる版がありません");
  await db.lesson.update({ where: { id }, data: { status: s } });
  await audit({ actorId: viewer.id, action: "lesson.status", targetType: "lesson", targetId: id, metadata: { status: s } });
  revalidatePath("/admin/content");
  revalidatePath("/curriculum");
}
