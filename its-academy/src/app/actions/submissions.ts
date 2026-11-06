"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { SubmissionStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { requireUser } from "@/lib/auth/dal";
import { GITHUB_REPO_URL } from "@/lib/validation";
import type { FormState } from "./auth";

const PENDING = ["SUBMITTED", "IN_REVIEW", "RESUBMITTED"] as const;

const Input = z.object({
  assignmentId: z.cuid(),
  intent: z.enum(["draft", "submit"]),
  text: z.string().max(100_000, "100,000 文字以内にしてください").optional(),
  repoUrl: z.string().trim().max(300).optional(),
  note: z.string().max(2000, "2,000 文字以内にしてください").optional(),
});

export async function saveSubmission(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser(["STUDENT"]);
  const parsed = Input.safeParse({
    assignmentId: formData.get("assignmentId"),
    intent: formData.get("intent"),
    text: (formData.get("text") as string | null) ?? undefined,
    repoUrl: (formData.get("repoUrl") as string | null) ?? undefined,
    note: (formData.get("note") as string | null) ?? undefined,
  });
  if (!parsed.success) {
    return { fieldErrors: Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])) };
  }
  const input = parsed.data;

  const assignment = await db.assignment.findFirst({
    where: { id: input.assignmentId, status: "PUBLISHED", module: { course: { enrollments: { some: { userId: user.id } } } } },
    include: { module: { select: { courseId: true } } },
  });
  if (!assignment) return { error: "課題が見つかりません。" };

  if (assignment.lessonId) {
    const done = await db.lessonProgress.findFirst({ where: { userId: user.id, lessonId: assignment.lessonId, status: "COMPLETED" } });
    if (!done) return { error: "前提のレッスンを完了すると提出できます。" };
  }

  const text = input.text?.trim() || null;
  const repoUrl = input.repoUrl || null;
  if (input.intent === "submit") {
    if (assignment.type === "GITHUB_REPO" && (!repoUrl || !GITHUB_REPO_URL.test(repoUrl))) {
      return { fieldErrors: { repoUrl: "https://github.com/ユーザー名/リポジトリ名 の形式で入力してください" } };
    }
    if (assignment.type !== "GITHUB_REPO" && !text) {
      return { fieldErrors: { text: "提出内容を入力してください" } };
    }
  }
  if (repoUrl && !GITHUB_REPO_URL.test(repoUrl)) {
    return { fieldErrors: { repoUrl: "https://github.com/ユーザー名/リポジトリ名 の形式で入力してください" } };
  }

  const latest = await db.submission.findFirst({ where: { assignmentId: assignment.id, userId: user.id }, orderBy: { attemptNo: "desc" } });
  if (latest?.status === "PASSED") return { error: "この課題は合格済みです。" };
  if (latest && (PENDING as readonly string[]).includes(latest.status)) return { error: "レビュー待ちの提出があります。結果が出るまでお待ちください。" };

  const hadFeedback = await db.submission.count({
    where: { assignmentId: assignment.id, userId: user.id, status: { in: ["CHANGES_REQUESTED", "FAILED"] } },
  });
  const submitStatus: SubmissionStatus = hadFeedback > 0 ? "RESUBMITTED" : "SUBMITTED";
  const data = {
    text,
    repoUrl,
    note: input.note?.trim() || null,
    status: (input.intent === "submit" ? submitStatus : "DRAFT") as SubmissionStatus,
    submittedAt: input.intent === "submit" ? new Date() : null,
  };

  const submission =
    latest?.status === "DRAFT"
      ? await db.submission.update({ where: { id: latest.id }, data })
      : await db.submission.create({ data: { ...data, assignmentId: assignment.id, userId: user.id, attemptNo: (latest?.attemptNo ?? 0) + 1 } });

  if (input.intent === "submit") {
    const enrollment = await db.enrollment.findFirst({ where: { userId: user.id, courseId: assignment.module.courseId } });
    if (enrollment?.instructorId) {
      await db.notification.create({
        data: {
          userId: enrollment.instructorId,
          title: `${submitStatus === "RESUBMITTED" ? "再提出" : "提出"}: ${assignment.title}`,
          body: `${user.name} さんが課題を${submitStatus === "RESUBMITTED" ? "再提出" : "提出"}しました (${submission.attemptNo} 回目)。`,
          link: `/admin/reviews/${submission.id}`,
        },
      });
    }
    await audit({ actorId: user.id, action: "submission.submit", targetType: "submission", targetId: submission.id });
  }

  revalidatePath(`/assignments/${assignment.slug}`);
  revalidatePath("/assignments");
  return { ok: input.intent === "submit" ? "提出しました。講師のレビューをお待ちください。" : "下書きを保存しました。" };
}
