import "server-only";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { canViewStudent } from "@/lib/auth/roles";
import type { SessionUser } from "@/lib/auth/session";
import {
  computeMetrics,
  requiredMetricInput,
  daysSince,
  isStagnant,
  last7Days,
  learningStreak,
  nextAction,
  paceAgainstTarget,
  jstDayStart,
  reachableAssignments,
  type SubmissionStatusValue,
} from "@/lib/progress/metrics";
import { strugglingAssignments, weakLessons } from "@/lib/progress/guidance";
import { getStagnationThreshold } from "./settings";
import { applyScheduledPublishes } from "@/lib/content/publish";

type LessonStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

/** 受講生データの閲覧権限を確認する。権限がなければ 404 */
export async function assertCanViewStudent(viewer: SessionUser, studentId: string) {
  const enrollments = await db.enrollment.findMany({ where: { userId: studentId }, select: { instructorId: true } });
  const instructors = enrollments.map((e) => e.instructorId).filter((x): x is string => !!x);
  if (!canViewStudent(viewer, studentId, instructors)) notFound();
}

/**
 * 講師・管理者が受講生に対して記録を残す (採点・コメント・スキル評価) ときの確認。
 * 閲覧できることに加えて、相手が受講生であること・自分自身でないことを求める
 * (受講生から講師に変更された人が、自分の提出を採点できないようにする)。
 */
export async function assertCanActOnStudent(viewer: SessionUser, studentId: string) {
  if (viewer.id === studentId) notFound();
  const target = await db.user.findUnique({ where: { id: studentId }, select: { role: true } });
  if (target?.role !== "STUDENT") notFound();
  await assertCanViewStudent(viewer, studentId);
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
    // 公開できる版のあるレッスンだけ (型の上でも currentVersion が null でないことを保証する)
    lessons: m.lessons.filter((l): l is typeof l & { currentVersion: NonNullable<typeof l.currentVersion> } => l.currentVersion !== null),
  }));
}

/**
 * 複数の受講生の進捗に必要なデータを、テーブルごとに 1 回のクエリでまとめて読み込む
 * (受講生ごとに読むと、人数に比例してクエリが増えるため)。
 */
async function loadOverviewData(studentIds: string[]) {
  const ids = [...new Set(studentIds)];
  const [students, enrollmentRows, threshold] = await Promise.all([
    db.user.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, email: true, affiliation: true, joinedAt: true, role: true, lastLoginAt: true, isActive: true },
    }),
    db.enrollment.findMany({
      where: { userId: { in: ids } },
      orderBy: { createdAt: "asc" },
      include: { course: true, instructor: { select: { id: true, name: true } } },
    }),
    getStagnationThreshold(),
  ]);
  const enrollmentByUser = new Map<string, (typeof enrollmentRows)[number]>();
  for (const e of enrollmentRows) if (!enrollmentByUser.has(e.userId)) enrollmentByUser.set(e.userId, e);
  const courseIds = [...new Set([...enrollmentByUser.values()].map((e) => e.courseId))];

  const [curricula, progress, submissions, quizAttempts, sessions, skills, comments] = await Promise.all([
    Promise.all(courseIds.map(async (id) => [id, await getPublishedCurriculum(id)] as const)),
    db.lessonProgress.findMany({ where: { userId: { in: ids } }, select: { userId: true, lessonId: true, status: true, lastViewedAt: true } }),
    db.submission.findMany({
      where: { userId: { in: ids } },
      orderBy: [{ attemptNo: "desc" }, { createdAt: "desc" }, { id: "asc" }], // 同じ回数の提出の並びも毎回同じにする
      include: { reviews: { orderBy: { createdAt: "desc" }, include: { reviewer: { select: { name: true } } } } },
    }),
    // 理解度チェックと学習時間は行数が多いので、データベース側で集計してから受け取る
    db.$queryRaw<{ userId: string; lessonId: string; best: number; passed: boolean }[]>`
      SELECT qa."userId", lv."lessonId", MAX(qa.score)::int AS best, BOOL_OR(qa.passed) AS passed
      FROM quiz_attempts qa JOIN lesson_versions lv ON lv.id = qa."lessonVersionId"
      WHERE qa."userId" = ANY(${ids}) GROUP BY 1, 2`,
    // 日本時間の日付ごとの活動 (kind: quiz = 理解度チェックを受けた日, ping = 学習画面を開いていた日, start = その日に始めた学習の分数)
    db.$queryRaw<{ userId: string; kind: string; day: string; last: Date; minutes: number; seconds: number }[]>`
      SELECT "userId", 'quiz' AS kind, to_char("createdAt" + interval '9 hours', 'YYYY-MM-DD') AS day,
             MAX("createdAt") AS last, 0::int AS minutes, 0::int AS seconds
      FROM quiz_attempts WHERE "userId" = ANY(${ids}) GROUP BY 1, 3
      UNION ALL
      SELECT "userId", 'ping', to_char("lastPingAt" + interval '9 hours', 'YYYY-MM-DD'),
             MAX("lastPingAt"), 0, 0
      FROM learning_sessions WHERE "userId" = ANY(${ids}) GROUP BY 1, 3
      UNION ALL
      SELECT "userId", 'start', to_char("startedAt" + interval '9 hours', 'YYYY-MM-DD'),
             MAX("startedAt"), SUM(ROUND("durationSec" / 60.0))::int, SUM("durationSec")::int
      FROM learning_sessions WHERE "userId" = ANY(${ids}) GROUP BY 1, 3`,
    db.skillAssessment.findMany({ where: { userId: { in: ids } }, orderBy: { createdAt: "desc" }, include: { assessor: { select: { name: true } } } }),
    db.instructorComment.findMany({ where: { studentId: { in: ids } }, orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } }),
  ]);

  const group = <T,>(rows: T[], key: (r: T) => string) => {
    const m = new Map<string, T[]>();
    for (const r of rows) {
      const k = key(r);
      const list = m.get(k);
      if (list) list.push(r);
      else m.set(k, [r]);
    }
    return m;
  };
  return {
    students: new Map(students.map((s) => [s.id, s])),
    enrollmentByUser,
    curricula: new Map(curricula),
    progress: group(progress, (r) => r.userId),
    submissions: group(submissions, (r) => r.userId),
    quizBest: group(quizAttempts, (r) => r.userId),
    activityDays: group(sessions, (r) => r.userId),
    skills: group(skills, (r) => r.userId),
    comments: group(comments, (r) => r.studentId),
    threshold,
  };
}

type OverviewData = Awaited<ReturnType<typeof loadOverviewData>>;

/** 読み込み済みのデータから、受講生 1 名の進捗を計算する */
function buildOverview(studentId: string, data: OverviewData, now: Date) {
  const student = data.students.get(studentId);
  if (!student) return null;
  const enrollment = data.enrollmentByUser.get(studentId) ?? null;
  if (!enrollment) {
    return { student, enrollment: null } as const;
  }
  const modules = data.curricula.get(enrollment.courseId) ?? [];
  const progress = data.progress.get(studentId) ?? [];
  const submissions = data.submissions.get(studentId) ?? [];
  const quizBestRows = data.quizBest.get(studentId) ?? [];
  const activityDays = data.activityDays.get(studentId) ?? [];
  const skills = data.skills.get(studentId) ?? [];
  const comments = data.comments.get(studentId) ?? [];
  const threshold = data.threshold;

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
      title: l.currentVersion.title,
      minutes: l.currentVersion.estimatedMinutes,
      level: m.level,
      moduleTitle: m.title,
      optional: m.optional,
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

  // 前提レッスンが非公開の課題は、受講生が取り組めないため一覧と指標から外す
  const publishedLessonIds = new Set(lessons.map((l) => l.id));
  const assignments = modules.flatMap((m) =>
    reachableAssignments(m.assignments, publishedLessonIds).map((a) => {
      const latest = latestByAssignment.get(a.id) ?? null;
      const latestReview = latest?.reviews[0] ?? null;
      return {
        id: a.id,
        slug: a.slug,
        title: a.title,
        type: a.type,
        level: m.level,
        optional: m.optional,
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
  const quizPassed = new Set<string>();
  for (const q of quizBestRows) {
    bestQuiz.set(q.lessonId, Math.max(bestQuiz.get(q.lessonId) ?? 0, q.best));
    if (q.passed) quizPassed.add(q.lessonId);
  }

  // スキル評価: 観点ごとに最新のもの
  const latestSkill = new Map<string, (typeof skills)[number]>();
  for (const s of skills) if (!latestSkill.has(s.skill)) latestSkill.set(s.skill, s);

  // 指標 A〜E は必修のレッスン・課題・理解度チェックだけで計算する (選択モジュールは含めない)
  const metrics = computeMetrics(
    requiredMetricInput({
      lessons: lessons.map((l) => ({ id: l.id, optional: l.optional, completed: l.status === "COMPLETED" })),
      assignments,
      quizBest: bestQuiz,
      latestSkillLevels: [...latestSkill.values()].map((s) => s.level),
    }),
  );

  // 最終学習日時と連続学習日数は「何かをした日」から求める (集計済みの日ごとの記録を使う)
  const activity = [
    ...progress.map((p) => p.lastViewedAt),
    ...activityDays.filter((d) => d.kind !== "start").map((d) => new Date(d.last)),
    ...submissions.filter((s) => s.submittedAt).map((s) => s.submittedAt!),
  ];
  const lastActivity = activity.length ? new Date(Math.max(...activity.map((d) => d.getTime()))) : null;
  const startDays = activityDays.filter((d) => d.kind === "start");
  const totalMinutes = Math.round(startDays.reduce((s, x) => s + x.seconds, 0) / 60);
  // 直近 7 日の集計用: 日ごとの分数を「その日に始めた 1 件の学習」として渡す (分数は学習ごとに丸めてから合計済み)
  const sessionsByDay = startDays.map((d) => ({ startedAt: jstDayStart(d.day), durationSec: d.minutes * 60 }));

  // 苦手分野: 理解度チェックを受けたが一度も合格していない必修レッスン / 修正依頼・不合格の課題
  // (合格済みの課題は、何回目で合格しても対象にしない)
  const weak = weakLessons(lessons, new Set(bestQuiz.keys()), quizPassed);
  const struggling = strugglingAssignments(assignments);

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
    week: last7Days(sessionsByDay, now),
    totalMinutes,
    pace: paceAgainstTarget(enrollment.startedAt, enrollment.targetEndDate, metrics.lessonCompletion, now),
    current,
    weakLessons: weak,
    struggling,
    next: nextAction({ lessons, currentLessonId: enrollment.currentLessonId, assignments }),
  } as const;
}

/** 複数の受講生の進捗 (一覧・CSV 用)。呼び出し前に閲覧権限を確認すること */
export async function getStudentOverviews(studentIds: string[]) {
  const data = await loadOverviewData(studentIds);
  const now = new Date();
  return studentIds.map((id) => buildOverview(id, data, now)).filter((o): o is NonNullable<typeof o> => o !== null);
}

/**
 * 受講生 1 名の進捗をまとめて計算する。呼び出し前に assertCanViewStudent で権限を確認すること。
 */
export async function getStudentOverview(studentId: string) {
  const o = buildOverview(studentId, await loadOverviewData([studentId]), new Date());
  if (!o) notFound();
  return o;
}

export type StudentOverview = Extract<Awaited<ReturnType<typeof getStudentOverview>>, { modules: unknown }>;

export function hasEnrollment(o: Awaited<ReturnType<typeof getStudentOverview>> | null): o is StudentOverview {
  return !!o && o.enrollment !== null;
}
