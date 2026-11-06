"use client";

import { useState, useTransition } from "react";
import { submitQuiz, type QuizResult } from "@/app/actions/learning";
import { Button, cx } from "@/components/ui";

type Question = { id: string; question: string; choices: string[] };

export function Quiz({ lessonId, questions, passScore, alreadyPassed }: { lessonId: string; questions: Question[]; passScore: number; alreadyPassed: boolean }) {
  const [answers, setAnswers] = useState<(number | null)[]>(questions.map(() => null));
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const unanswered = answers.some((a) => a === null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        start(async () => {
          try {
            setResult(await submitQuiz(lessonId, answers));
          } catch {
            setError("採点に失敗しました。時間をおいて再度お試しください。");
          }
        });
      }}
      className="flex flex-col gap-6"
    >
      <p className="text-sm text-muted">
        合格ライン: {passScore} 点。{alreadyPassed && "このレッスンの理解度チェックには合格済みです (何度でも解き直せます)。"}
      </p>
      {questions.map((q, qi) => {
        const r = result?.results[qi];
        return (
          <fieldset key={q.id} className="rounded-xl border border-border p-4">
            <legend className="px-1 font-semibold">
              問 {qi + 1}. {q.question}
            </legend>
            <div className="mt-2 flex flex-col gap-2">
              {q.choices.map((c, ci) => (
                <label
                  key={ci}
                  className={cx(
                    "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2",
                    r && ci === r.answerIndex ? "border-success bg-success-soft" : "border-border",
                    r && answers[qi] === ci && !r.correct && "border-danger bg-danger-soft",
                  )}
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={ci}
                    checked={answers[qi] === ci}
                    onChange={() => {
                      setResult(null);
                      setAnswers((prev) => prev.map((a, i) => (i === qi ? ci : a)));
                    }}
                    className="size-4 accent-[var(--accent)]"
                  />
                  <span>{c}</span>
                </label>
              ))}
            </div>
            {r && (
              <p className={cx("mt-3 text-sm", r.correct ? "text-success" : "text-danger")}>
                {r.correct ? "正解" : "不正解"}: <span className="text-text">{r.explanation}</span>
              </p>
            )}
          </fieldset>
        );
      })}
      <div aria-live="polite">
        {result && (
          <p className={cx("rounded-lg p-3 font-semibold", result.passed ? "bg-success-soft text-success" : "bg-warning-soft text-warning")}>
            {result.score} 点 — {result.passed ? "合格です。下の「学習完了にする」を押せるようになりました。" : "合格ラインに届きませんでした。解説を読んでもう一度挑戦しましょう。"}
          </p>
        )}
        {error && <p className="text-danger" role="alert">{error}</p>}
      </div>
      <div>
        <Button type="submit" disabled={pending || unanswered}>
          {pending ? "採点しています…" : "採点する"}
        </Button>
        {unanswered && <span className="ml-3 text-sm text-muted">すべての問題に回答すると採点できます</span>}
      </div>
    </form>
  );
}
