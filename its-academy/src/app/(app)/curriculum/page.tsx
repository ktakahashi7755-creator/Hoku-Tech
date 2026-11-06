import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { isStaff } from "@/lib/auth/roles";
import { getPublishedCurriculum, getStudentOverview, hasEnrollment } from "@/lib/queries/student";
import { Badge, Card, EmptyState, PageHeader, ProgressBar } from "@/components/ui";
import { LessonBadge, SubmissionBadge } from "@/components/status-badge";

export const metadata: Metadata = { title: "カリキュラム" };

export default async function CurriculumPage() {
  const user = await requireUser();
  const staff = isStaff(user.role);
  const overview = staff ? null : await getStudentOverview(user.id);
  const courseId = overview?.enrollment?.courseId ?? (staff ? (await db.course.findFirst({ where: { status: "PUBLISHED" } }))?.id : undefined);
  if (!courseId) return <EmptyState>受講中のコースがありません。</EmptyState>;

  const course = await db.course.findUniqueOrThrow({ where: { id: courseId } });
  const modules = await getPublishedCurriculum(courseId);
  const status = new Map(hasEnrollment(overview) ? overview.lessons.map((l) => [l.id, l.status]) : []);
  const aStatus = new Map(hasEnrollment(overview) ? overview.assignments.map((a) => [a.id, a]) : []);

  return (
    <div>
      <PageHeader title={course.title} description={`${course.description} (標準 ${course.weeks} 週間)`} />
      {hasEnrollment(overview) && (
        <div className="mb-8 max-w-md">
          <ProgressBar value={overview.metrics.lessonCompletion} label="教材の履修率" />
        </div>
      )}
      <ol className="flex flex-col gap-6">
        {modules.map((m) => {
          const done = m.lessons.filter((l) => status.get(l.id) === "COMPLETED").length;
          return (
            <li key={m.id}>
              <Card>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h2 className="flex flex-wrap items-center gap-2 text-lg font-bold">
                    <span className="text-accent">{m.level}</span>
                    {m.title}
                    {m.optional && <Badge tone="accent">任意 (発展)</Badge>}
                  </h2>
                  <span className="text-sm text-muted">
                    標準 {m.weeks} 週{m.lessons.length > 0 && !staff ? ` ・ ${done} / ${m.lessons.length} 完了` : ""}
                  </span>
                </div>
                <p className="mt-1 text-muted">{m.description}</p>
                {m.lessons.length === 0 ? (
                  <p className="mt-3"><Badge>教材公開前</Badge></p>
                ) : (
                  <ul className="mt-4 divide-y divide-border">
                    {m.lessons.map((l) => (
                      <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                        <Link href={`/lessons/${l.slug}`} className="text-accent underline-offset-2 hover:underline">
                          {l.currentVersion.title}
                        </Link>
                        <span className="flex items-center gap-3 text-sm text-muted">
                          {l.currentVersion.estimatedMinutes} 分
                          {!staff && <LessonBadge status={status.get(l.id) ?? "NOT_STARTED"} />}
                        </span>
                      </li>
                    ))}
                    {m.assignments.map((a) => (
                      <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                        <Link href={staff ? `/admin/reviews?assignment=${a.slug}` : `/assignments/${a.slug}`} className="font-semibold text-accent underline-offset-2 hover:underline">
                          課題: {a.title}
                        </Link>
                        {!staff && <SubmissionBadge status={aStatus.get(a.id)?.latestStatus ?? null} />}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
