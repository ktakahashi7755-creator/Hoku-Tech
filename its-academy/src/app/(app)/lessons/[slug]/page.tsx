import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { isStaff } from "@/lib/auth/roles";
import { LessonContentSchema } from "@/lib/content/schema";
import { getPublishedCurriculum, getStudentOverview, hasEnrollment } from "@/lib/queries/student";
import { Badge, ButtonLink, Card, cx, ProgressBar } from "@/components/ui";
import { LessonBadge } from "@/components/status-badge";
import { RichText } from "@/components/lesson/rich-text";
import { CodeBlock, OutputBlock } from "@/components/lesson/code-block";
import { Quiz } from "@/components/lesson/quiz";
import { CompleteButton } from "@/components/lesson/complete-button";
import { LessonActivity } from "@/components/lesson/lesson-activity";

const SECTIONS = [
  ["goals", "できるようになること"],
  ["prerequisites", "前提知識"],
  ["concepts", "概念の解説"],
  ["examples", "図解・具体例"],
  ["code", "サンプルコードと実行結果"],
  ["exercises", "自分で試す演習"],
  ["quiz", "理解度チェック"],
  ["workplace", "実務での利用場面"],
  ["errors", "よくあるエラー"],
  ["review", "復習ポイント"],
] as const;

function SectionTitle({ id, n, children }: { id: string; n: number; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-28 text-lg font-bold">
      <span className="mr-2 text-accent">{String(n).padStart(2, "0")}</span>
      {children}
    </h2>
  );
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireUser();
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
  const flat = modules.flatMap((m) => m.lessons.map((l) => ({ slug: l.slug, title: l.currentVersion!.title, level: m.level })));
  const index = flat.findIndex((l) => l.slug === slug);
  const prev = index > 0 ? flat[index - 1] : null;
  const next = index >= 0 && index < flat.length - 1 ? flat[index + 1] : null;

  const statusOf = new Map(hasEnrollment(overview) ? overview.lessons.map((l) => [l.slug, l.status]) : []);
  const myStatus = statusOf.get(slug) ?? "NOT_STARTED";
  const passedAttempt = staff
    ? null
    : await db.quizAttempt.findFirst({ where: { userId: user.id, lessonVersionId: version.id, passed: true } });
  const relatedAssignment = await db.assignment.findFirst({ where: { lessonId: lesson.id, status: "PUBLISHED" } });

  const chapterNav = (
    <nav aria-label="章の一覧">
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
                      <span className="min-w-0">{l.currentVersion!.title}</span>
                      {st === "COMPLETED" && <span className="sr-only">(完了)</span>}
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
        <details className="rounded-xl border border-border lg:hidden">
          <summary className="flex min-h-11 cursor-pointer items-center px-4 font-semibold">章の一覧を開く</summary>
          <div className="p-2">{chapterNav}</div>
        </details>
        <div className="hidden lg:block">{chapterNav}</div>
      </aside>

      <article className="min-w-0">
        <header className="mb-8 border-b border-border pb-6">
          <p className="text-sm text-muted">
            {lesson.module.level} {lesson.module.title} ・ レッスン {index + 1} / {flat.length}
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{version.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <Badge tone="accent">学習目安 {version.estimatedMinutes} 分</Badge>
            {!staff && <LessonBadge status={myStatus} />}
            <span className="text-muted">版 {version.version}</span>
          </div>
          {hasEnrollment(overview) && (
            <div className="mt-4 max-w-sm">
              <ProgressBar value={overview.metrics.lessonCompletion} label="コース内の進捗" />
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

        <div className="flex flex-col gap-10">
          <section>
            <SectionTitle id="goals" n={1}>このレッスンでできるようになること</SectionTitle>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              {content.objectives.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </section>

          <section>
            <SectionTitle id="prerequisites" n={2}>必要な前提知識</SectionTitle>
            {content.prerequisites.length ? (
              <ul className="mt-3 list-disc space-y-1 pl-6">
                {content.prerequisites.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-muted">特にありません。</p>
            )}
          </section>

          <section>
            <SectionTitle id="concepts" n={3}>概念の解説</SectionTitle>
            <div className="mt-3 flex flex-col gap-6">
              {content.explanation.map((e) => (
                <div key={e.heading}>
                  <h3 className="font-bold">{e.heading}</h3>
                  <div className="mt-2">
                    <RichText text={e.body} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {content.examples.length > 0 && (
            <section>
              <SectionTitle id="examples" n={4}>図解・具体例</SectionTitle>
              <div className="mt-3 flex flex-col gap-4">
                {content.examples.map((e) => (
                  <Card key={e.title} tone="muted">
                    <h3 className="font-bold">{e.title}</h3>
                    <div className="mt-2">
                      <RichText text={e.body} />
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {content.code.length > 0 && (
            <section>
              <SectionTitle id="code" n={5}>動作するサンプルコードと実行結果</SectionTitle>
              <p className="mt-2 text-sm text-muted">このコードは教材の公開前に実際に実行し、下の実行結果と一致することを確認しています。</p>
              <div className="mt-3 flex flex-col gap-4">
                {content.code.map((c, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <CodeBlock code={c.source} language={c.language} filename={c.filename} />
                    {c.output && <OutputBlock output={c.output} />}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <SectionTitle id="exercises" n={6}>自分で試す演習</SectionTitle>
            <div className="mt-3 flex flex-col gap-4">
              {content.exercises.map((e) => (
                <Card key={e.title} className="border-l-4 border-l-accent">
                  <h3 className="font-bold">{e.title}</h3>
                  <div className="mt-2">
                    <RichText text={e.task} />
                  </div>
                  {e.hint && (
                    <details className="mt-3">
                      <summary className="min-h-11 cursor-pointer content-center text-sm font-semibold text-accent">ヒントを見る</summary>
                      <p className="text-sm">{e.hint}</p>
                    </details>
                  )}
                  {e.answer && (
                    <details className="mt-1">
                      <summary className="min-h-11 cursor-pointer content-center text-sm font-semibold text-accent">解答例を見る (自分で考えてから)</summary>
                      <pre className="mt-1 overflow-x-auto rounded-lg bg-code p-3 text-sm">
                        <code className="font-mono">{e.answer}</code>
                      </pre>
                    </details>
                  )}
                </Card>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle id="quiz" n={7}>理解度チェック</SectionTitle>
            <div className="mt-3">
              {staff ? (
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
                  passScore={content.quiz.passScore}
                  alreadyPassed={!!passedAttempt}
                  questions={content.quiz.questions.map(({ id, question, choices }) => ({ id, question, choices }))}
                />
              )}
            </div>
          </section>

          <section>
            <SectionTitle id="workplace" n={8}>実務での利用場面</SectionTitle>
            <div className="mt-3">
              <RichText text={content.workplaceUse} />
            </div>
          </section>

          <section>
            <SectionTitle id="errors" n={9}>よくあるエラー</SectionTitle>
            <div className="mt-3 flex flex-col gap-3">
              {content.commonErrors.map((e) => (
                <Card key={e.error}>
                  <p className="font-mono text-sm font-semibold text-danger">{e.error}</p>
                  <dl className="mt-2 grid gap-1 text-sm sm:grid-cols-[4rem_1fr]">
                    <dt className="text-muted">原因</dt>
                    <dd>{e.cause}</dd>
                    <dt className="text-muted">対処</dt>
                    <dd>{e.fix}</dd>
                  </dl>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle id="review" n={10}>復習ポイント</SectionTitle>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              {content.reviewPoints.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </section>

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
        </div>
      </article>

      <aside className="hidden xl:block">
        <nav aria-label="このページの目次" className="sticky top-28 text-sm">
          <p className="font-semibold text-muted">目次</p>
          <ol className="mt-2 space-y-1">
            {SECTIONS.map(([id, label]) => (
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
