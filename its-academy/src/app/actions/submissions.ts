"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { SubmissionStatus } from "@prisma/client";
import { isUniqueViolation } from "@/lib/db-errors";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { requireUser } from "@/lib/auth/dal";
import { GITHUB_REPO_URL, submitsRepository } from "@/lib/validation";
import { fieldErrors, type FormState } from "@/lib/form-state";

const PENDING = ["SUBMITTED", "IN_REVIEW", "RESUBMITTED"] as const;

const Input = z.object({
  assignmentId: z.cuid(),
  intent: z.enum(["draft", "submit"]),
  text: z.string().max(100_000, "100,000 文字以内にしてください").optional(),
  repoUrl: z.string().trim().max(300).optional(),
  note: z.string().max(2000, "2,000 文字以内にしてください").optional(),
});

const REPO_URL_MESSAGE = "https://github.com/ユーザー名/リポジトリ名 の形式で入力してください";

export async function saveSubmission(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser(["STUDENT"]);
  const parsed = Input.safeParse({
    assignmentId: formData.get("assignmentId"),
    intent: formData.get("intent"),
    text: formData.get("text") ?? undefined,
    repoUrl: formData.get("repoUrl") ?? undefined,
    note: formData.get("note") ?? undefined,
  });
  if (!parsed.success) {
    const errors = fieldErrors(parsed.error);
    // 押したボタン (提出 / 下書き保存) が届かなかった場合は、入力欄ではなくフォーム全体のエラーとして伝える
    return errors.intent ? { error: "操作を受け付けられませんでした。ページを再読み込みしてから、もう一度ボタンを押してください。" } : { fieldErrors: errors };
  }
  const input = parsed.data;

  const assignment = await db.assignment.findFirst({
    where: { id: input.assignmentId, status: "PUBLISHED", module: { course: { enrollments: { some: { userId: user.id } } } } },
    include: { module: { select: { courseId: true } } },
  });
  if (!assignment) return { error: "課題が見つかりません。" };
  // 休学中・退校した受講生は提出できない (教材の閲覧は続けられる)。復帰は管理者が受講設定で行う
  const enrollment = await db.enrollment.findFirst({
    where: { userId: user.id, courseId: assignment.module.courseId },
    // 通知は、現在も講師として利用中の担当者にだけ送る (ロール変更・利用停止の後に、受講生の情報が届かないように)
    select: { status: true, instructorId: true, instructor: { select: { role: true, isActive: true } } },
  });
  if (enrollment && (enrollment.status === "PAUSED" || enrollment.status === "WITHDRAWN")) {
    return { error: "受講状態が「休止中」または「退校」のため提出できません。再開したい場合は担当講師または管理者に連絡してください。" };
  }

  if (assignment.lessonId) {
    const done = await db.lessonProgress.findFirst({ where: { userId: user.id, lessonId: assignment.lessonId, status: "COMPLETED" } });
    if (!done) return { error: "前提のレッスンを完了すると提出できます。" };
  }

  const text = input.text?.trim() || null;
  const repoUrl = input.repoUrl || null;
  // URL の形式は提出時に確かめる (下書きは入力途中でも保存できるようにする。下書きの URL はリンクとして表示しない)
  if (input.intent === "submit" && submitsRepository(assignment.type) && (!repoUrl || !GITHUB_REPO_URL.test(repoUrl))) {
    return { fieldErrors: { repoUrl: REPO_URL_MESSAGE } };
  }
  if (input.intent === "submit" && !submitsRepository(assignment.type) && !text) {
    return { fieldErrors: { text: "提出内容を入力してください" } };
  }

  const latest = await db.submission.findFirst({ where: { assignmentId: assignment.id, userId: user.id }, orderBy: { attemptNo: "desc" } });
  if (latest?.status === "PASSED") return { error: "この課題は合格済みです。" };
  if (latest && (PENDING as readonly string[]).includes(latest.status)) return { error: "レビュー待ちの提出があります。結果が出るまでお待ちください。" };

  const hadFeedback = await db.submission.count({
    where: { assignmentId: assignment.id, userId: user.id, status: { in: ["CHANGES_REQUESTED", "FAILED"] } },
  });
  const submitStatus: SubmissionStatus = hadFeedback > 0 ? "RESUBMITTED" : "SUBMITTED";
  const status: SubmissionStatus = input.intent === "submit" ? submitStatus : "DRAFT";
  const data = {
    text,
    repoUrl,
    note: input.note?.trim() || null,
    status,
    submittedAt: input.intent === "submit" ? new Date() : null,
  };

  let submission;
  try {
    if (latest?.status === "DRAFT") {
      // 別のタブで先に提出されていたら、下書きに戻さない (状態を条件にした更新)
      const updated = await db.submission.updateMany({ where: { id: latest.id, status: "DRAFT" }, data });
      if (updated.count === 0) return { error: "この課題はほかの画面で提出されています。ページを再読み込みして状態を確認してください。" };
      submission = { ...latest, ...data };
    } else {
      submission = await db.submission.create({ data: { ...data, assignmentId: assignment.id, userId: user.id, attemptNo: (latest?.attemptNo ?? 0) + 1 } });
    }
  } catch (e) {
    // 連続で押された場合など、同じ回数の提出が先に作られていたとき (一意制約違反)
    if (isUniqueViolation(e)) {
      return { error: "同じ提出がすでに保存されています。ページを再読み込みして状態を確認してください。" };
    }
    throw e;
  }

  if (input.intent === "submit") {
    if (enrollment?.instructorId && enrollment.instructor?.role === "INSTRUCTOR" && enrollment.instructor.isActive) {
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
