import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getSignedInUser, requireUser } from "@/lib/auth/dal";
import { isStaff } from "@/lib/auth/roles";
import { LessonContentSchema } from "@/lib/content/schema";
import { getPublishedCurriculum, getStudentOverview, hasEnrollment } from "@/lib/queries/student";
import { Badge, ButtonLink, cx, ProgressBar } from "@/components/ui";
import { LessonBadge } from "@/components/status-badge";
import { LESSON_SECTIONS, LessonSections } from "@/components/lesson/lesson-sections";
import { applyScheduledPublishes } from "@/lib/content/publish";
import { Quiz } from "@/components/lesson/quiz";
import { CompleteButton } from "@/components/lesson/complete-button";
import { LessonActivity } from "@/components/lesson/lesson-activity";

/** タブ・読み上げで「どのレッスンか」が分かるよう、レッスン名をページ名にする (公開中のレッスン名のみ。本文や個人の情報は含めない) */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  // ログインしていない人には、レッスン名もレッスンがあるかどうかも見せない (ページ名はログインの確認より先に作られるため)
  if (!(await getSignedInUser())) return { title: "レッスン" };
  const lesson = await db.lesson.findUnique({ where: { slug }, select: { status: true, currentVersion: { select: { title: true } } } });
  return { title: lesson?.status === "PUBLISHED" && lesson.currentVersion ? lesson.currentVersion.title : "レッスン" };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireUser();
  await applyScheduledPublishes();
  const lesson = await db.lesson.findUnique({
    where: { slug },
    include: { currentVersion: true, module: { include: { course: true } } },
  });
  if (!lesson?.currentVersion || lesson.status !== "PUBLISHED") notFound();

  const staff = isStaff(user.role);
  if (!staff) {
    const enrolled = await db.enrollment.findFirst({ where: { userId: user.id, courseId: lesson.module.courseId } });
    if (!enrolled) notFound();
  }

  const version = lesson.currentVersion;
  const content = LessonContentSchema.parse(version.content);
  const overview = staff ? null : await getStudentOverview(user.id);
  const modules = await getPublishedCurriculum(lesson.module.courseId);
  const flat = modules.flatMap((m) => m.lessons.map((l) => ({ slug: l.slug, title: l.currentVersion.title, level: m.level, optional: m.optional })));
  const index = flat.findIndex((l) => l.slug === slug);
  // 「何番目のレッスンか」は、必修と選択 (L8) を分けて数える (履修率・ホームの「必修 N / M」と同じ数え方にする)
  const group = flat.filter((l) => l.optional === lesson.module.optional);
  const groupIndex = group.findIndex((l) => l.slug === slug);
  const prev = index > 0 ? flat[index - 1] : null;
  const next = index >= 0 && index < flat.length - 1 ? flat[index + 1] : null;

  const statusOf = new Map(hasEnrollment(overview) ? overview.lessons.map((l) => [l.slug, l.status]) : []);
  const myStatus = statusOf.get(slug) ?? "NOT_STARTED";
  const passedAttempt = staff
    ? null
    : await db.quizAttempt.findFirst({ where: { userId: user.id, lessonVersionId: version.id, passed: true } });
  const relatedAssignment = await db.assignment.findFirst({ where: { lessonId: lesson.id, status: "PUBLISHED" } });

  const chapterNav = (
    <nav aria-label="レッスンの一覧">
      {modules
        .filter((m) => m.lessons.length > 0)
        .map((m) => (
          <div key={m.id} className="mb-4">
            <p className="px-2 text-xs font-semibold text-muted">
              {m.level} {m.title}
            </p>
            <ul className="mt-1">
              {m.lessons.map((l) => {
                const st = statusOf.get(l.slug);
                return (
                  <li key={l.id}>
                    <Link
                      href={`/lessons/${l.slug}`}
                      aria-current={l.slug === slug ? "page" : undefined}
                      className={cx(
                        "flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm",
                        l.slug === slug ? "bg-accent-soft font-semibold text-accent-strong" : "hover:bg-surface",
                      )}
                    >
                      <span aria-hidden className={cx("size-2 shrink-0 rounded-full", st === "COMPLETED" ? "bg-success" : st === "IN_PROGRESS" ? "bg-accent" : "bg-border")} />
                      <span className="min-w-0">{l.currentVersion.title}</span>
                      {st === "COMPLETED" && <span className="sr-only">(学習完了)</span>}
                      {st === "IN_PROGRESS" && <span className="sr-only">(学習中)</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
    </nav>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_200px]">
      {!staff && <LessonActivity lessonId={lesson.id} />}

      {/* 章ナビゲーション: PC は左に常時表示、スマホは折りたたみ (教材を優先表示) */}
      <aside className="lg:sticky lg:top-28 lg:max-h-[calc(100dvh-8rem)] lg:self-start lg:overflow-y-auto">
        {/* レッスンの一覧 (35 件) を Tab で通らずに本文へ進めるようにする */}
        <a
          href="#lesson-content"
          className="sr-only focus:not-sr-only focus:mb-2 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-lg focus:bg-accent-soft focus:px-3 focus:font-semibold focus:text-accent-strong"
        >
          レッスンの本文へ移動
        </a>
        <details className="rounded-xl border border-border lg:hidden">
          <summary className="flex min-h-11 cursor-pointer items-center px-4 font-semibold">レッスンの一覧を開く</summary>
          <div className="p-2">{chapterNav}</div>
        </details>
        <div className="hidden lg:block">{chapterNav}</div>
      </aside>

      <article id="lesson-content" tabIndex={-1} className="min-w-0 outline-none">
        <header className="mb-8 border-b border-border pb-6">
          <p className="text-sm text-muted">
            {lesson.module.level} {lesson.module.title} ・ {lesson.module.optional ? "選択レッスン" : "必修レッスン"} {groupIndex + 1} / {group.length}
            {lesson.module.optional && " (履修率には含めません)"}
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{version.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <Badge tone="accent">学習目安 {version.estimatedMinutes} 分</Badge>
            {!staff && <LessonBadge status={myStatus} />}
            {/* 版の番号は教材管理の情報のため、講師・管理者にだけ表示する */}
            {staff && <span className="text-muted">版 {version.version}</span>}
          </div>
          {hasEnrollment(overview) && (
            <div className="mt-4 max-w-sm">
              <ProgressBar value={overview.metrics.lessonCompletion} label={`教材の履修率 (必修 ${overview.metrics.completedLessons} / ${overview.metrics.totalLessons})`} />
            </div>
          )}
          {content.videoUrl && (
            <p className="mt-4">
              <a href={content.videoUrl} className="text-accent underline" target="_blank" rel="noreferrer">
                解説動画を開く
              </a>
            </p>
          )}
        </header>

        <LessonSections
          content={content}
          quizSlot={
            staff ? (
              <ul className="list-decimal space-y-2 pl-6">
                {content.quiz.questions.map((q) => (
                  <li key={q.id}>
                    {q.question} <span className="text-sm text-muted">(正解: {q.choices[q.answerIndex]})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <Quiz
                lessonId={lesson.id}
                versionId={version.id}
                passScore={content.quiz.passScore}
                alreadyPassed={!!passedAttempt}
                questions={content.quiz.questions.map(({ id, question, choices }) => ({ id, question, choices }))}
              />
            )
          }
        >
          {!staff && (
            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="font-bold">学習完了</h2>
              <div className="mt-3">
                <CompleteButton lessonId={lesson.id} completed={myStatus === "COMPLETED"} canComplete={!!passedAttempt} />
              </div>
              {relatedAssignment && myStatus === "COMPLETED" && (
                <p className="mt-3 text-sm">
                  このレッスンの後は課題「
                  <Link className="text-accent underline" href={`/assignments/${relatedAssignment.slug}`}>
                    {relatedAssignment.title}
                  </Link>
                  」に取り組みましょう。
                </p>
              )}
            </section>
          )}

          <nav aria-label="前後のレッスン" className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
            {prev ? (
              <ButtonLink variant="secondary" href={`/lessons/${prev.slug}`}>
                ← 前のレッスン: {prev.title}
              </ButtonLink>
            ) : (
              <span />
            )}
            {next && <ButtonLink href={`/lessons/${next.slug}`}>次のレッスン: {next.title} →</ButtonLink>}
          </nav>
        </LessonSections>
      </article>

      <aside className="hidden xl:block">
        <nav aria-label="このページの目次" className="sticky top-28 text-sm">
          <p className="font-semibold text-muted">目次</p>
          <ol className="mt-2 space-y-1">
            {/* 内容がない節 (図解・サンプルコード) は本文に出ないため、目次にも出さない */}
            {LESSON_SECTIONS.filter(([id]) => (id === "examples" ? content.examples.length > 0 : id === "code" ? content.code.length > 0 : true)).map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="text-muted hover:text-accent">
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>
    </div>
  );
}
