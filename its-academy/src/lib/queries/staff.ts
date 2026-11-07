import "server-only";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth/roles";
import type { SessionUser } from "@/lib/auth/session";
import { suggestGuidance } from "@/lib/progress/guidance";
import { SKILL_LABEL } from "@/lib/progress/skills";
import { getStudentOverviews, hasEnrollment, type StudentOverview } from "./student";

/** 閲覧できる受講生の ID。管理者は全員、講師は担当の受講生のみ */
export async function visibleStudentIds(viewer: SessionUser): Promise<string[]> {
  if (isAdmin(viewer.role)) {
    return (await db.user.findMany({ where: { role: "STUDENT" }, select: { id: true }, orderBy: { createdAt: "asc" } })).map((u) => u.id);
  }
  return (
    // 受講生の権限のままの人だけ (講師・管理者に変わった人の受講の記録は対象にしない)
    await db.enrollment.findMany({ where: { instructorId: viewer.id, user: { role: "STUDENT" } }, select: { userId: true }, orderBy: { createdAt: "asc" } })
  ).map((e) => e.userId);
}

type StudentRow = StudentOverview & { pendingReviews: number };

export async function listStudentOverviews(viewer: SessionUser): Promise<StudentRow[]> {
  const ids = await visibleStudentIds(viewer);
  const overviews = await getStudentOverviews(ids, { comments: false }); // まとめて読み込む (受講生の数によらずクエリ数は一定)
  return overviews.filter(hasEnrollment).map((o) => ({
    ...o,
    pendingReviews: o.assignments.filter((a) => a.latestStatus === "SUBMITTED" || a.latestStatus === "IN_REVIEW" || a.latestStatus === "RESUBMITTED").length,
  }));
}

export function guidanceFor(o: StudentRow) {
  return suggestGuidance({
    stagnant: o.stagnant,
    daysSinceActivity: o.daysSinceActivity,
    thresholdDays: o.threshold,
    paceDiff: o.pace?.diff ?? null,
    failedQuizLessons: o.weakLessons.map((l) => l.title),
    struggling: o.struggling.map((a) => ({ title: a.title, attempts: a.attempts, status: a.latestStatus })),
    lowSkills: o.skills.filter((s) => s.level <= 2).map((s) => SKILL_LABEL[s.skill] ?? s.skill),
    pendingReviews: o.pendingReviews,
  });
}

/** コース全体の集計 */
export async function courseSummary(rows: StudentRow[], viewer: SessionUser) {
  const ids = rows.map((r) => r.student.id);
  const reviews = await db.review.findMany({ where: { submission: { userId: { in: ids } } }, select: { decision: true, submissionId: true } });
  const enrollments = await db.enrollment.findMany({ where: { userId: { in: ids } } });
  const completed = enrollments.filter((e) => e.status === "COMPLETED" && e.completedAt);
  const avgDays = completed.length
    ? Math.round(completed.reduce((s, e) => s + (e.completedAt!.getTime() - e.startedAt.getTime()) / 86_400_000, 0) / completed.length)
    : null;
  const instructors = isAdmin(viewer.role)
    ? await db.user.findMany({
        where: { role: "INSTRUCTOR" },
        select: { id: true, name: true, _count: { select: { instructedEnrolls: true } } },
        orderBy: { name: "asc" },
      })
    : [];
  return {
    students: rows.length,
    stagnant: rows.filter((r) => r.stagnant).length,
    pendingReviews: rows.reduce((s, r) => s + r.pendingReviews, 0),
    passRate: reviews.length ? Math.round((reviews.filter((r) => r.decision === "PASS").length / reviews.length) * 100) : null,
    completionRate: enrollments.length ? Math.round((completed.length / enrollments.length) * 100) : null,
    avgDays,
    avgLessonCompletion: rows.length ? Math.round(rows.reduce((s, r) => s + r.metrics.lessonCompletion, 0) / rows.length) : 0,
    instructors,
  };
}
