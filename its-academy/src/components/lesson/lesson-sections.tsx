import type { ReactNode } from "react";
import type { LessonContent } from "@/lib/content/schema";
import { allCodeVerified } from "@/lib/content/draft";
import { ScrollRegion, cx } from "@/components/ui";
import { Icon, type IconName } from "@/components/icons";
import { RichText } from "./rich-text";
import { CodeBlock, OutputBlock } from "./code-block";

export const LESSON_SECTIONS = [
  ["goals", "このレッスンでできるようになること"],
  ["prerequisites", "必要な前提知識"],
  ["concepts", "概念の解説"],
  ["examples", "図解・具体例"],
  ["code", "動作するサンプルコードと実行結果"],
  ["exercises", "自分で試す演習"],
  ["quiz", "理解度チェック"],
  ["workplace", "実務での利用場面"],
  ["errors", "よくあるエラー"],
  ["review", "復習ポイント"],
] as const;

export type LessonSectionId = (typeof LESSON_SECTIONS)[number][0];

/** 各項目のアイコン (見出しの文字で意味が伝わるため、飾りとして扱う) */
export const SECTION_ICON: Record<LessonSectionId, IconName> = {
  goals: "target",
  prerequisites: "list",
  concepts: "book",
  examples: "bulb",
  code: "code",
  exercises: "pencil",
  quiz: "quiz",
  workplace: "briefcase",
  errors: "alert",
  review: "refresh",
};

/** 1 つの項目を白いカードにまとめる。番号・アイコン・見出しで、どの項目かを読み分けられるようにする */
function Section({ id, n, title, tone = "default", children }: { id: LessonSectionId; n: number; title: string; tone?: "default" | "accent"; children: ReactNode }) {
  return (
    <section
      aria-labelledby={id}
      className={cx("min-w-0 rounded-2xl border p-5 shadow-card sm:p-7", tone === "accent" ? "border-accent/25 bg-accent-soft/60" : "border-border bg-bg")}
    >
      <h2 id={id} className="flex scroll-mt-28 items-center gap-3 text-lg font-bold sm:text-xl">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Icon name={SECTION_ICON[id]} className="size-5" />
        </span>
        <span>
          <span className="mr-2 font-mono text-accent tabular-nums">{String(n).padStart(2, "0")}</span>
          {title}
        </span>
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** チェックの印つきの箇条書き (できるようになること・復習ポイント) */
function CheckList({ items, tone }: { items: string[]; tone: "success" | "accent" }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((o) => (
        <li key={o} className="flex gap-3">
          <span className={cx("mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-white", tone === "success" ? "bg-success" : "bg-accent")}>
            <Icon name="check" className="size-3.5" strokeWidth={2.5} />
          </span>
          <span className="min-w-0">{o}</span>
        </li>
      ))}
    </ul>
  );
}

/** レッスン本文 (13 項目のうち本文部分)。受講生の画面と CMS のプレビューで共通に使う */
export function LessonSections({ content, quizSlot, children }: { content: LessonContent; quizSlot: ReactNode; children?: ReactNode }) {
  const label = (id: LessonSectionId) => LESSON_SECTIONS.find(([k]) => k === id)![1];
  return (
    <div className="flex flex-col gap-6">
      <Section id="goals" n={1} title={label("goals")} tone="accent">
        <CheckList items={content.objectives} tone="success" />
      </Section>

      <Section id="prerequisites" n={2} title={label("prerequisites")}>
        {content.prerequisites.length ? (
          <ul className="flex flex-col gap-2">
            {content.prerequisites.map((p) => (
              <li key={p} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-accent" />
                <span className="min-w-0">{p}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">特にありません。</p>
        )}
      </Section>

      <Section id="concepts" n={3} title={label("concepts")}>
        <div className="flex flex-col gap-7">
          {content.explanation.map((e) => (
            <div key={e.heading}>
              <h3 className="border-l-4 border-accent pl-3 font-bold">{e.heading}</h3>
              <div className="mt-3">
                <RichText text={e.body} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {content.examples.length > 0 && (
        <Section id="examples" n={4} title={label("examples")}>
          <div className="flex flex-col gap-4">
            {content.examples.map((e) => (
              <div key={e.title} className="rounded-xl border border-border bg-surface p-5">
                <h3 className="flex items-center gap-2 font-bold">
                  <Icon name="bulb" className="size-[18px] shrink-0 text-accent" />
                  {e.title}
                </h3>
                <div className="mt-2">
                  <RichText text={e.body} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {content.code.length > 0 && (
        <Section id="code" n={5} title={label("code")}>
          <p className="flex items-start gap-2 text-sm text-muted">
            <Icon name="checkCircle" className="mt-0.5 size-4 shrink-0 text-success" />
            {allCodeVerified(content)
              ? "このコードは教材の公開前に実際に実行し、下の実行結果と一致することを自動で確認しています。"
              : "実行結果は講師が確認したものです。自分の環境でも実行して確かめましょう。"}
          </p>
          <div className="mt-4 flex flex-col gap-6">
            {content.code.map((c, i) => (
              <div key={i} className="flex flex-col gap-3">
                <CodeBlock code={c.source} language={c.language} filename={c.filename} />
                {c.output && <OutputBlock output={c.output} />}
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section id="exercises" n={6} title={label("exercises")}>
        <div className="flex flex-col gap-4">
          {content.exercises.map((e, i) => (
            <div key={e.title} className="rounded-xl border border-border border-l-4 border-l-accent bg-bg p-5">
              <p className="text-xs font-semibold tracking-wide text-accent">演習 {i + 1}</p>
              <h3 className="mt-0.5 font-bold">{e.title}</h3>
              <div className="mt-2">
                <RichText text={e.task} />
              </div>
              {(e.hint || e.answer) && (
                <div className="mt-3 flex flex-col gap-2">
                  {e.hint && (
                    <details className="group rounded-lg bg-surface">
                      <summary className="flex min-h-11 cursor-pointer items-center gap-2 px-3 text-sm font-semibold text-accent">
                        <Icon name="bulb" className="size-4" />
                        ヒントを見る
                      </summary>
                      <p className="px-3 pb-3 text-sm">{e.hint}</p>
                    </details>
                  )}
                  {e.answer && (
                    <details className="rounded-lg bg-surface">
                      <summary className="flex min-h-11 cursor-pointer items-center gap-2 px-3 text-sm font-semibold text-accent">
                        <Icon name="code" className="size-4" />
                        解答例を見る (自分で考えてから)
                      </summary>
                      <div className="px-3 pb-3">
                        <ScrollRegion label={`解答例: ${e.title}`} className="rounded-lg border border-border bg-code">
                          <pre className="p-3 text-sm">
                            <code className="font-mono">{e.answer}</code>
                          </pre>
                        </ScrollRegion>
                      </div>
                    </details>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section id="quiz" n={7} title={label("quiz")}>
        {quizSlot}
      </Section>

      <Section id="workplace" n={8} title={label("workplace")}>
        <RichText text={content.workplaceUse} />
      </Section>

      <Section id="errors" n={9} title={label("errors")}>
        <div className="flex flex-col gap-4">
          {content.commonErrors.map((e) => (
            <div key={e.error} className="overflow-hidden rounded-xl border border-danger/30">
              <p className="flex items-start gap-2 bg-danger-soft px-4 py-3 font-mono text-sm font-semibold break-all text-danger">
                <Icon name="alert" className="mt-0.5 size-4 shrink-0" />
                <span className="min-w-0">{e.error}</span>
              </p>
              <dl className="grid gap-x-4 gap-y-2 bg-bg px-4 py-3 text-sm sm:grid-cols-[4rem_1fr]">
                <dt className="font-semibold text-muted">原因</dt>
                <dd>{e.cause}</dd>
                <dt className="font-semibold text-muted">対処</dt>
                <dd>{e.fix}</dd>
              </dl>
            </div>
          ))}
        </div>
      </Section>

      <Section id="review" n={10} title={label("review")}>
        <CheckList items={content.reviewPoints} tone="accent" />
      </Section>

      {children}
    </div>
  );
}
