import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { isStaff } from "@/lib/auth/roles";
import { getPublishedCurriculum, getStudentOverview, hasEnrollment } from "@/lib/queries/student";
import { Badge, cx, EmptyState, PageHeader, ProgressBar } from "@/components/ui";
import { Icon } from "@/components/icons";
import { LessonBadge, SubmissionBadge } from "@/components/status-badge";

export const metadata: Metadata = { title: "カリキュラム" };

export default async function CurriculumPage() {
  const user = await requireUser();
  const staff = isStaff(user.role);
  const overview = staff ? null : await getStudentOverview(user.id);
  const courseId = overview?.enrollment?.courseId ?? (staff ? (await db.course.findFirst({ where: { status: "PUBLISHED" } }))?.id : undefined);
  if (!courseId) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="カリキュラム" />
        <EmptyState>受講中のコースがありません。担当講師または管理者に連絡してください。</EmptyState>
      </div>
    );
  }

  const course = await db.course.findUniqueOrThrow({ where: { id: courseId } });
  const modules = await getPublishedCurriculum(courseId);
  const status = new Map(hasEnrollment(overview) ? overview.lessons.map((l) => [l.id, l.status]) : []);
  const aStatus = new Map(hasEnrollment(overview) ? overview.assignments.map((a) => [a.id, a]) : []);

  return (
    <div>
      <PageHeader title={course.title} description={`${course.description} (標準 ${course.weeks} 週間)`} />
      {hasEnrollment(overview) && (
        <div className="mb-8 max-w-md rounded-2xl border border-border bg-bg p-5 shadow-card">
          <ProgressBar value={overview.metrics.lessonCompletion} label={`教材の履修率 (必修 ${overview.metrics.completedLessons} / ${overview.metrics.totalLessons})`} />
        </div>
      )}
      <ol className="flex flex-col gap-5">
        {modules.map((m) => {
          const done = m.lessons.filter((l) => status.get(l.id) === "COMPLETED").length;
          const allDone = m.lessons.length > 0 && done === m.lessons.length && !staff;
          return (
            <li key={m.id}>
              <section className="min-w-0 rounded-2xl border border-border bg-bg shadow-card">
                <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                  <div className="flex min-w-0 gap-4">
                    <span
                      aria-hidden="true"
                      className={cx(
                        "inline-flex size-12 shrink-0 items-center justify-center rounded-xl font-mono text-base font-bold",
                        allDone ? "bg-success-soft text-success" : "bg-accent-soft text-accent",
                      )}
                    >
                      {m.level}
                    </span>
                    <div className="min-w-0">
                      <h2 className="flex flex-wrap items-center gap-2 text-lg font-bold">
                        <span className="sr-only">{m.level}</span>
                        {m.title}
                        {m.optional && <Badge tone="accent">選択 (発展)</Badge>}
                        {allDone && <Badge tone="success">完了</Badge>}
                      </h2>
                      <p className="mt-1 text-sm text-muted">{m.description}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 text-sm whitespace-nowrap text-muted sm:items-end">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="calendar" className="size-4" />
                      標準 {m.weeks} 週{m.lessons.length > 0 && !staff ? ` ・ ${done} / ${m.lessons.length} 完了` : ""}
                    </span>
                    {m.lessons.length > 0 && !staff && (
                      <span aria-hidden="true" className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2 sm:w-32">
                        <span className={cx("block h-full rounded-full", allDone ? "bg-success" : "bg-accent")} style={{ width: `${(done / m.lessons.length) * 100}%` }} />
                      </span>
                    )}
                  </div>
                </div>
                {m.lessons.length === 0 ? (
                  <p className="border-t border-border px-5 py-4 sm:px-6">
                    <Badge>教材公開前</Badge>
                  </p>
                ) : (
                  <ul className="border-t border-border">
                    {m.lessons.map((l) => {
                      const st = status.get(l.id) ?? "NOT_STARTED";
                      return (
                        <li key={l.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-border px-5 py-3 last:border-b-0 sm:px-6">
                          <span className="flex min-w-0 items-center gap-3">
                            {!staff && (
                              <Icon
                                name={st === "COMPLETED" ? "checkCircle" : st === "IN_PROGRESS" ? "play" : "circle"}
                                className={cx("size-5 shrink-0", st === "COMPLETED" ? "text-success" : st === "IN_PROGRESS" ? "text-accent" : "text-border-strong")}
                              />
                            )}
                            <Link href={`/lessons/${l.slug}`} className="min-w-0 text-accent underline-offset-2 hover:underline">
                              {l.currentVersion.title}
                            </Link>
                          </span>
                          <span className="ml-8 flex items-center gap-3 text-sm text-muted sm:ml-0">
                            <span className="inline-flex items-center gap-1">
                              <Icon name="clock" className="size-4" />
                              {l.currentVersion.estimatedMinutes} 分
                            </span>
                            {!staff && <LessonBadge status={st} />}
                          </span>
                        </li>
                      );
                    })}
                    {m.assignments.map((a) => (
                      <li key={a.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-border bg-surface/70 px-5 py-3 last:border-b-0 sm:px-6">
                        <span className="flex min-w-0 items-center gap-3">
                          <Icon name="clipboard" className="size-5 shrink-0 text-accent" />
                          <Link href={staff ? `/admin/reviews?assignment=${a.slug}` : `/assignments/${a.slug}`} className="min-w-0 font-semibold text-accent underline-offset-2 hover:underline">
                            課題: {a.title}
                          </Link>
                        </span>
                        {!staff && (
                          <span className="ml-8 sm:ml-0">
                            <SubmissionBadge status={aStatus.get(a.id)?.latestStatus ?? null} locked={aStatus.get(a.id)?.unlocked === false} />
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
