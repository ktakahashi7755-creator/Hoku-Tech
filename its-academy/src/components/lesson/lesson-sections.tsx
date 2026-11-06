import type { ReactNode } from "react";
import type { LessonContent } from "@/lib/content/schema";
import { allCodeVerified } from "@/lib/content/draft";
import { Card, ScrollRegion } from "@/components/ui";
import { RichText } from "./rich-text";
import { CodeBlock, OutputBlock } from "./code-block";

export const LESSON_SECTIONS = [
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

function SectionTitle({ id, n, children }: { id: string; n: number; children: ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-28 text-lg font-bold">
      <span className="mr-2 text-accent">{String(n).padStart(2, "0")}</span>
      {children}
    </h2>
  );
}

/** レッスン本文 (13 項目のうち本文部分)。受講生の画面と CMS のプレビューで共通に使う */
export function LessonSections({ content, quizSlot, children }: { content: LessonContent; quizSlot: ReactNode; children?: ReactNode }) {
  return (
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
              <p className="mt-2 text-sm text-muted">
                {allCodeVerified(content)
                  ? "このコードは教材の公開前に実際に実行し、下の実行結果と一致することを自動で確認しています。"
                  : "実行結果は講師が確認したものです。自分の環境でも実行して確かめましょう。"}
              </p>
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
                      <ScrollRegion label={`解答例: ${e.title}`} className="mt-1 rounded-lg bg-code">
                        <pre className="p-3 text-sm">
                          <code className="font-mono">{e.answer}</code>
                        </pre>
                      </ScrollRegion>
                    </details>
                  )}
                </Card>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle id="quiz" n={7}>理解度チェック</SectionTitle>
            <div className="mt-3">
              {quizSlot}
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

      {children}
    </div>
  );
}
