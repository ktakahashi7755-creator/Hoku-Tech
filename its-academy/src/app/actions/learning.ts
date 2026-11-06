"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { LessonContentSchema } from "@/lib/content/schema";
import { scoreQuiz } from "@/lib/progress/metrics";

const PING_GAP_MS = 3 * 60 * 1000; // これより間隔が空いたら別の学習セッションとして記録
const MAX_PING_CREDIT_SEC = 90; // 1 回の ping で加算する最大秒数 (放置による水増しを防ぐ)

const LessonId = z.cuid();

/** 受講生が受講登録しているコースの、公開中のレッスンだけを取得する */
async function loadLessonForStudent(userId: string, lessonId: string) {
  const lesson = await db.lesson.findFirst({
    where: { id: lessonId, status: "PUBLISHED", module: { course: { enrollments: { some: { userId } } } } },
    include: { currentVersion: true, module: { select: { courseId: true } } },
  });
  if (!lesson?.currentVersion) throw new Error("レッスンが見つかりません");
  return { lesson, version: lesson.currentVersion };
}

export async function recordLessonView(rawLessonId: string): Promise<void> {
  const user = await requireUser(["STUDENT"]);
  const lessonId = LessonId.parse(rawLessonId);
  const { lesson, version } = await loadLessonForStudent(user.id, lessonId);
  const now = new Date();
  await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    create: { userId: user.id, lessonId, lessonVersionId: version.id },
    update: { lastViewedAt: now, lessonVersionId: version.id },
  });
  await db.enrollment.updateMany({
    where: { userId: user.id, courseId: lesson.module.courseId },
    data: { currentLessonId: lessonId },
  });
}

/** 学習時間の記録。画面が表示されている間、クライアントから 60 秒ごとに呼ばれる */
export async function pingLearning(rawLessonId: string): Promise<void> {
  const user = await requireUser(["STUDENT"]);
  const lessonId = LessonId.parse(rawLessonId);
  await loadLessonForStudent(user.id, lessonId);
  const now = new Date();
  const recent = await db.learningSession.findFirst({
    where: { userId: user.id, lessonId, lastPingAt: { gte: new Date(now.getTime() - PING_GAP_MS) } },
    orderBy: { lastPingAt: "desc" },
  });
  if (recent) {
    const credit = Math.min(Math.round((now.getTime() - recent.lastPingAt.getTime()) / 1000), MAX_PING_CREDIT_SEC);
    await db.learningSession.update({ where: { id: recent.id }, data: { lastPingAt: now, durationSec: { increment: credit } } });
  } else {
    await db.learningSession.create({ data: { userId: user.id, lessonId, startedAt: now, lastPingAt: now } });
  }
}

/**
 * 採点結果。正解の選択肢と解説は合格したときだけ返す
 * (不合格のたびに正解を返すと、答えを写して合格でき、理解度 C と学習完了の条件が意味を失うため)。
 */
export type QuizResult = {
  score: number;
  passScore: number;
  passed: boolean;
  /** 解いている間に教材が更新された場合 true。採点せず、再読み込みを求める */
  outdated?: boolean;
  results: { id: string; correct: boolean; answerIndex: number | null; explanation: string | null }[];
};

const QuizAnswers = z.array(z.number().int().min(0).nullable()).max(50);

export async function submitQuiz(rawLessonId: string, rawVersionId: string, rawAnswers: unknown): Promise<QuizResult> {
  const user = await requireUser(["STUDENT"]);
  const lessonId = LessonId.parse(rawLessonId);
  const answers = QuizAnswers.parse(rawAnswers);
  const { version } = await loadLessonForStudent(user.id, lessonId);
  const content = LessonContentSchema.parse(version.content);
  // 画面を開いた後に新しい版が公開された場合、古い問題への回答を新しい版で採点しない
  if (z.cuid().parse(rawVersionId) !== version.id) {
    return { score: 0, passScore: content.quiz.passScore, passed: false, outdated: true, results: [] };
  }
  const questions = content.quiz.questions;
  const score = scoreQuiz(
    questions.map((q) => q.answerIndex),
    questions.map((_, i) => answers[i] ?? null),
  );
  const passed = score >= content.quiz.passScore;
  await db.quizAttempt.create({ data: { userId: user.id, lessonVersionId: version.id, answers, score, passed } });
  revalidatePath(`/lessons/${(await db.lesson.findUniqueOrThrow({ where: { id: lessonId } })).slug}`);
  return {
    score,
    passScore: content.quiz.passScore,
    passed,
    results: questions.map((q, i) => ({
      id: q.id,
      correct: answers[i] === q.answerIndex,
      answerIndex: passed ? q.answerIndex : null,
      explanation: passed ? q.explanation : null,
    })),
  };
}

export async function completeLesson(rawLessonId: string): Promise<{ error?: string }> {
  const user = await requireUser(["STUDENT"]);
  const lessonId = LessonId.parse(rawLessonId);
  const { lesson, version } = await loadLessonForStudent(user.id, lessonId);
  // 「ページを開いただけ」では完了にしない。現在の版の理解度チェックに合格していることをサーバー側で確認する
  const passed = await db.quizAttempt.findFirst({ where: { userId: user.id, lessonVersionId: version.id, passed: true } });
  if (!passed) return { error: "理解度チェックに合格すると、学習完了にできます。" };
  const now = new Date();
  await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    create: { userId: user.id, lessonId, lessonVersionId: version.id, status: "COMPLETED", completedAt: now, completedVersionId: version.id },
    update: { status: "COMPLETED", completedAt: now, completedVersionId: version.id, lastViewedAt: now },
  });
  revalidatePath(`/lessons/${lesson.slug}`);
  revalidatePath("/home");
  return {};
}
