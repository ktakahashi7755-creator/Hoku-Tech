import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getSignedInUser, requireUser } from "@/lib/auth/dal";
import { isStaff } from "@/lib/auth/roles";
import { LessonContentSchema } from "@/lib/content/schema";
import { getPublishedCurriculum, getStudentOverview, hasEnrollment } from "@/lib/queries/student";
import { cx, ProgressBar } from "@/components/ui";
import { Icon } from "@/components/icons";
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

  // モジュール内で何番目か (見出しの「L2-3」のような番号に使う)
  const currentModule = modules.find((m) => m.lessons.some((l) => l.slug === slug));
  const numberInModule = (currentModule?.lessons.findIndex((l) => l.slug === slug) ?? -1) + 1;
  // 内容がない節 (図解・サンプルコード) は本文に出ないため、目次にも出さない
  const sections = LESSON_SECTIONS.map(([id, label], i) => ({ id, label, n: i + 1 })).filter(({ id }) =>
    id === "examples" ? content.examples.length > 0 : id === "code" ? content.code.length > 0 : true,
  );

  const chapterNav = (
    <nav aria-label="レッスンの一覧">
      {modules
        .filter((m) => m.lessons.length > 0)
        .map((m) => (
          <div key={m.id} className="mb-5">
            <p className="flex items-center gap-2 px-2 text-xs font-semibold text-muted">
              <span className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-text">{m.level}</span>
              {m.title}
            </p>
            <ul className="mt-1.5 flex flex-col gap-0.5">
              {m.lessons.map((l) => {
                const st = statusOf.get(l.slug);
                const current = l.slug === slug;
                return (
                  <li key={l.id}>
                    <Link
                      href={`/lessons/${l.slug}`}
                      aria-current={current ? "page" : undefined}
                      className={cx(
                        "flex min-h-10 items-start gap-2.5 rounded-xl px-2 py-2 text-sm leading-snug transition-colors",
                        current ? "bg-accent-soft font-semibold text-accent-strong" : "text-text hover:bg-surface",
                      )}
                    >
                      <Icon
                        name={current ? "play" : st === "COMPLETED" ? "checkCircle" : "circle"}
                        className={cx(
                          "mt-px size-[18px] shrink-0",
                          current || st === "IN_PROGRESS" ? "text-accent" : st === "COMPLETED" ? "text-success" : "text-border-strong",
                        )}
                      />
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
    <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[248px_minmax(0,1fr)_220px]">
      {!staff && <LessonActivity lessonId={lesson.id} />}

      {/* 章ナビゲーション: PC は左に常時表示、スマホは折りたたみ (教材を優先表示) */}
      <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
        {/* レッスンの一覧 (35 件) を Tab で通らずに本文へ進めるようにする */}
        <a
          href="#lesson-content"
          className="sr-only focus:not-sr-only focus:mb-2 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-lg focus:bg-accent-soft focus:px-3 focus:font-semibold focus:text-accent-strong"
        >
          レッスンの本文へ移動
        </a>
        <details className="rounded-2xl border border-border bg-bg shadow-card lg:hidden">
          <summary className="flex min-h-12 cursor-pointer items-center gap-2 px-4 font-semibold">
            <Icon name="list" className="size-5 text-accent" />
            レッスンの一覧を開く
          </summary>
          <div className="border-t border-border p-2">{chapterNav}</div>
        </details>
        <div className="hidden lg:block">{chapterNav}</div>
      </aside>

      <article id="lesson-content" tabIndex={-1} className="min-w-0 outline-none">
        <nav aria-label="パンくずリスト" className="mb-4 text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <li>
              <Link href={staff ? "/admin" : "/home"} className="hover:text-accent hover:underline">
                {staff ? "ダッシュボード" : "ホーム"}
              </Link>
            </li>
            <li aria-hidden="true">
              <Icon name="chevronRight" className="size-3.5" />
            </li>
            <li>
              <Link href="/curriculum" className="hover:text-accent hover:underline">
                カリキュラム
              </Link>
            </li>
            <li aria-hidden="true">
              <Icon name="chevronRight" className="size-3.5" />
            </li>
            <li>
              {lesson.module.level} {lesson.module.title}
            </li>
            <li aria-hidden="true">
              <Icon name="chevronRight" className="size-3.5" />
            </li>
            <li aria-current="page" className="font-semibold text-text">
              {version.title}
            </li>
          </ol>
        </nav>

        <header className="mb-6 rounded-2xl border border-border bg-bg p-5 shadow-card sm:p-7">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="rounded-lg bg-accent px-2.5 py-1 font-mono text-sm font-bold text-white">
              {lesson.module.level}
              {numberInModule > 0 && `-${numberInModule}`}
            </span>
            <p className="text-sm text-muted">
              {lesson.module.title} ・ {lesson.module.optional ? "選択レッスン" : "必修レッスン"} {groupIndex + 1} / {group.length}
              {lesson.module.optional && " (履修率には含めません)"}
            </p>
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-[32px] sm:leading-tight">{version.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <Icon name="clock" className="size-[18px] text-accent" />
              学習目安 {version.estimatedMinutes} 分
            </span>
            {!staff && <LessonBadge status={myStatus} />}
            {/* 版の番号は教材管理の情報のため、講師・管理者にだけ表示する */}
            {staff && <span className="text-muted">版 {version.version}</span>}
          </div>
          {hasEnrollment(overview) && (
            <div className="mt-5 max-w-md">
              <ProgressBar value={overview.metrics.lessonCompletion} label={`教材の履修率 (必修 ${overview.metrics.completedLessons} / ${overview.metrics.totalLessons})`} />
            </div>
          )}
          {content.videoUrl && (
            <p className="mt-4">
              <a href={content.videoUrl} className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent underline" target="_blank" rel="noreferrer">
                <Icon name="play" className="size-5" />
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
            <section aria-labelledby="lesson-complete" className="rounded-2xl border border-success/30 bg-bg p-5 shadow-card sm:p-7">
              <h2 id="lesson-complete" className="flex items-center gap-3 text-lg font-bold">
                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-success-soft text-success">
                  <Icon name="trophy" className="size-5" />
                </span>
                学習完了
              </h2>
              <div className="mt-4">
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

          <nav aria-label="前後のレッスン" className="grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/lessons/${prev.slug}`}
                className="group flex min-h-16 items-center gap-3 rounded-2xl border border-border bg-bg p-4 shadow-card transition-colors hover:border-accent/50"
              >
                <Icon name="arrowLeft" className="size-5 shrink-0 text-accent" />
                <span className="min-w-0">
                  <span className="block text-xs text-muted">前のレッスン: </span>
                  <span className="block font-semibold group-hover:text-accent">{prev.title}</span>
                </span>
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}
            {next && (
              <Link
                href={`/lessons/${next.slug}`}
                className="flex min-h-16 items-center justify-end gap-3 rounded-2xl bg-accent p-4 text-right text-white shadow-card transition-colors hover:bg-accent-strong"
              >
                <span className="min-w-0">
                  <span className="block text-xs text-white/85">次のレッスン: </span>
                  <span className="block font-semibold">{next.title}</span>
                </span>
                <Icon name="arrowRight" className="size-5 shrink-0" />
              </Link>
            )}
          </nav>
        </LessonSections>
      </article>

      <aside className="hidden xl:block">
        <nav aria-label="このページの目次" className="sticky top-24 rounded-2xl border border-border bg-bg p-4 text-sm shadow-card">
          <p className="flex items-center gap-2 px-1 font-semibold">
            <Icon name="list" className="size-[18px] text-accent" />
            目次
          </p>
          <ol className="mt-3 flex flex-col gap-0.5">
            {sections.map(({ id, label, n }) => (
              <li key={id}>
                <a href={`#${id}`} className="flex min-h-9 items-center gap-2.5 rounded-lg px-1 py-1 text-muted hover:bg-surface hover:text-accent">
                  <span aria-hidden="true" className="inline-flex h-6 min-w-7 items-center justify-center rounded-md bg-surface-2 font-mono text-xs text-text tabular-nums">
                    {String(n).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 leading-snug">{label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>
    </div>
  );
}
