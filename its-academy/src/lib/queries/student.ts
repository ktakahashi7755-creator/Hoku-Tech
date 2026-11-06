import "server-only";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { canViewStudent } from "@/lib/auth/roles";
import type { SessionUser } from "@/lib/auth/session";
import {
  computeMetrics,
  daysSince,
  isStagnant,
  last7Days,
  learningStreak,
  nextAction,
  paceAgainstTarget,
  type SubmissionStatusValue,
} from "@/lib/progress/metrics";
import { getStagnationThreshold } from "./settings";
import { applyScheduledPublishes } from "@/lib/content/publish";

export type LessonStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

/** 受講生データの閲覧権限を確認する。権限がなければ 404 */
export async function assertCanViewStudent(viewer: SessionUser, studentId: string) {
  const enrollments = await db.enrollment.findMany({ where: { userId: studentId }, select: { instructorId: true } });
  const instructors = enrollments.map((e) => e.instructorId).filter((x): x is string => !!x);
  if (!canViewStudent(viewer, studentId, instructors)) notFound();
}

/** 公開中のカリキュラム (モジュール → レッスン) を順番どおりに返す */
export async function getPublishedCurriculum(courseId: string) {
  await applyScheduledPublishes();
  const modules = await db.module.findMany({
    where: { courseId },
    orderBy: { position: "asc" },
    include: {
      lessons: {
        where: { status: "PUBLISHED" },
        orderBy: { position: "asc" },
        include: { currentVersion: { select: { id: true, title: true, estimatedMinutes: true } } },
      },
      assignments: { where: { status: "PUBLISHED" }, orderBy: { position: "asc" } },
    },
  });
  return modules.map((m) => ({
    ...m,
    lessons: m.lessons.filter((l) => l.currentVersion),
  }));
}

/**
 * 受講生 1 名の進捗をまとめて計算する。呼び出し前に assertCanViewStudent で権限を確認すること。
 */
export async function getStudentOverview(studentId: string) {
  const student = await db.user.findUnique({
    where: { id: studentId },
    select: { id: true, name: true, email: true, affiliation: true, joinedAt: true, role: true, lastLoginAt: true, isActive: true },
  });
  if (!student) notFound();

  const enrollment = await db.enrollment.findFirst({
    where: { userId: studentId },
    orderBy: { createdAt: "asc" },
    include: { course: true, instructor: { select: { id: true, name: true } } },
  });
  if (!enrollment) {
    return { student, enrollment: null } as const;
  }

  const [modules, progress, submissions, quizAttempts, sessions, skills, comments, threshold] = await Promise.all([
    getPublishedCurriculum(enrollment.courseId),
    db.lessonProgress.findMany({ where: { userId: studentId } }),
    db.submission.findMany({
      where: { userId: studentId },
      orderBy: [{ attemptNo: "desc" }],
      include: { reviews: { orderBy: { createdAt: "desc" }, include: { reviewer: { select: { name: true } } } } },
    }),
    db.quizAttempt.findMany({ where: { userId: studentId }, include: { lessonVersion: { select: { lessonId: true } } } }),
    db.learningSession.findMany({ where: { userId: studentId }, orderBy: { startedAt: "desc" } }),
    db.skillAssessment.findMany({ where: { userId: studentId }, orderBy: { createdAt: "desc" }, include: { assessor: { select: { name: true } } } }),
    db.instructorComment.findMany({ where: { studentId }, orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } }),
    getStagnationThreshold(),
  ]);

  const now = new Date();
  const progressByLesson = new Map(progress.map((p) => [p.lessonId, p]));
  const lessonStatus = (lessonId: string): LessonStatus => {
    const p = progressByLesson.get(lessonId);
    if (!p) return "NOT_STARTED";
    return p.status === "COMPLETED" ? "COMPLETED" : "IN_PROGRESS";
  };

  const lessons = modules.flatMap((m) =>
    m.lessons.map((l) => ({
      id: l.id,
      slug: l.slug,
      title: l.currentVersion!.title,
      minutes: l.currentVersion!.estimatedMinutes,
      level: m.level,
      moduleTitle: m.title,
      status: lessonStatus(l.id),
    })),
  );

  // 課題ごとの最新提出
  const latestByAssignment = new Map<string, (typeof submissions)[number]>();
  for (const s of submissions) if (!latestByAssignment.has(s.assignmentId)) latestByAssignment.set(s.assignmentId, s);
  const attemptsByAssignment = new Map<string, number>();
  for (const s of submissions) {
    if (s.status !== "DRAFT") attemptsByAssignment.set(s.assignmentId, (attemptsByAssignment.get(s.assignmentId) ?? 0) + 1);
  }

  const assignments = modules.flatMap((m) =>
    m.assignments.map((a) => {
      const latest = latestByAssignment.get(a.id) ?? null;
      const latestReview = latest?.reviews[0] ?? null;
      return {
        id: a.id,
        slug: a.slug,
        title: a.title,
        type: a.type,
        level: m.level,
        passScore: a.passScore,
        unlocked: !a.lessonId || lessonStatus(a.lessonId) === "COMPLETED",
        latestStatus: (latest?.status ?? null) as SubmissionStatusValue | null,
        latestReviewScore: latestReview?.totalScore ?? null,
        latestReviewComment: latestReview?.comment ?? null,
        attempts: attemptsByAssignment.get(a.id) ?? 0,
        lastSubmittedAt: latest?.submittedAt ?? null,
      };
    }),
  );

  // 理解度: レッスンごとの最高得点 (公開中のレッスンのみ)
  const bestQuiz = new Map<string, number>();
  for (const q of quizAttempts) {
    const id = q.lessonVersion.lessonId;
    bestQuiz.set(id, Math.max(bestQuiz.get(id) ?? 0, q.score));
  }
  const publishedLessonIds = new Set(lessons.map((l) => l.id));
  const quizBestScores = [...bestQuiz.entries()].filter(([id]) => publishedLessonIds.has(id)).map(([, s]) => s);

  // スキル評価: 観点ごとに最新のもの
  const latestSkill = new Map<string, (typeof skills)[number]>();
  for (const s of skills) if (!latestSkill.has(s.skill)) latestSkill.set(s.skill, s);

  const metrics = computeMetrics({
    lessons: lessons.map((l) => ({ id: l.id, completed: l.status === "COMPLETED" })),
    assignments: assignments.map((a) => ({ id: a.id, type: a.type, latestStatus: a.latestStatus, latestReviewScore: a.latestReviewScore })),
    quizBestScores,
    latestSkillLevels: [...latestSkill.values()].map((s) => s.level),
  });

  const activity = [
    ...progress.map((p) => p.lastViewedAt),
    ...sessions.map((s) => s.lastPingAt),
    ...quizAttempts.map((q) => q.createdAt),
    ...submissions.filter((s) => s.submittedAt).map((s) => s.submittedAt!),
  ];
  const lastActivity = activity.length ? new Date(Math.max(...activity.map((d) => d.getTime()))) : null;
  const totalMinutes = Math.round(sessions.reduce((s, x) => s + x.durationSec, 0) / 60);

  // 苦手分野: 理解度チェックの最高点が合格点未満のレッスン / 修正依頼・不合格の課題
  const weakLessons = lessons.filter((l) => bestQuiz.has(l.id) && l.status !== "COMPLETED");
  const struggling = assignments.filter((a) => a.latestStatus === "CHANGES_REQUESTED" || a.latestStatus === "FAILED" || a.attempts >= 2);

  const current = lessons.find((l) => l.id === enrollment.currentLessonId) ?? lessons.find((l) => l.status !== "COMPLETED") ?? null;

  return {
    student,
    enrollment,
    modules,
    lessons,
    assignments,
    metrics,
    submissions,
    skills: [...latestSkill.values()],
    skillHistory: skills,
    comments,
    lastActivity,
    daysSinceActivity: daysSince(lastActivity, now),
    daysSinceStart: daysSince(enrollment.startedAt, now) ?? 0,
    stagnant: enrollment.status === "ACTIVE" && isStagnant(lastActivity, enrollment.startedAt, now, threshold),
    threshold,
    streak: learningStreak(activity, now),
    week: last7Days(sessions, now),
    totalMinutes,
    pace: paceAgainstTarget(enrollment.startedAt, enrollment.targetEndDate, metrics.lessonCompletion, now),
    current,
    weakLessons,
    struggling,
    next: nextAction({ lessons, currentLessonId: enrollment.currentLessonId, assignments }),
  } as const;
}

export type StudentOverview = Extract<Awaited<ReturnType<typeof getStudentOverview>>, { modules: unknown }>;

export function hasEnrollment(o: Awaited<ReturnType<typeof getStudentOverview>> | null): o is StudentOverview {
  return !!o && o.enrollment !== null;
}
