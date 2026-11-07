"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { submitQuiz, type QuizResult } from "@/app/actions/learning";
import { Button, cx } from "@/components/ui";

type Question = { id: string; question: string; choices: string[] };

export function Quiz({ lessonId, versionId, questions, passScore, alreadyPassed }: { lessonId: string; versionId: string; questions: Question[]; passScore: number; alreadyPassed: boolean }) {
  const [answers, setAnswers] = useState<(number | null)[]>(questions.map(() => null));
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const unanswered = answers.some((a) => a === null);
  // 採点中にボタンが無効になってフォーカスが失われた場合は、結果へ移す (採点したときだけ。完了後の再表示では動かさない)
  const submitted = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!submitted.current || (!result && !error)) return;
    submitted.current = false;
    if (document.activeElement === document.body) resultRef.current?.focus();
  }, [result, error]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        submitted.current = true;
        start(async () => {
          try {
            setResult(await submitQuiz(lessonId, versionId, answers));
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
        const answer = answers[qi];
        return (
          <fieldset key={q.id} className="min-w-0 rounded-xl border border-border p-4">
            {/* 長い問題文が枠線に重ならないよう、見出しを枠の内側に置く (float で fieldset の枠から外す) */}
            <legend className="float-left w-full font-semibold">
              問 {qi + 1}. {q.question}
            </legend>
            <div className="mt-2 flex flex-col gap-2 clear-both">
              {q.choices.map((c, ci) => (
                <label
                  key={ci}
                  className={cx(
                    "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2",
                    r && ci === r.answerIndex ? "border-success bg-success-soft" : "border-border",
                    r && answer === ci && !r.correct && "border-danger bg-danger-soft",
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
                  <span className="flex-1">{c}</span>
                  {/* 色だけに頼らず、文字でも示す */}
                  {r && ci === r.answerIndex && <span className="shrink-0 text-xs font-semibold text-success">正解</span>}
                  {r && answer === ci && !r.correct && <span className="shrink-0 text-xs font-semibold text-danger">あなたの回答</span>}
                </label>
              ))}
            </div>
            {r && (
              <p className={cx("mt-3 text-sm font-semibold", r.correct ? "text-success" : "text-danger")}>
                {r.correct ? "正解" : "不正解"}
                {r.explanation && <span className="font-normal text-text">: {r.explanation}</span>}
              </p>
            )}
          </fieldset>
        );
      })}
      <div
        aria-live="polite"
        tabIndex={-1}
        className="outline-none"
        ref={resultRef}
      >
        {result?.outdated && (
          <p role="alert" className="rounded-lg bg-warning-soft p-3 font-semibold text-warning">
            このレッスンの内容が更新されました。ページを再読み込みして、新しい問題で解き直してください。
          </p>
        )}
        {result && !result.outdated && (
          <p className={cx("rounded-lg p-3 font-semibold", result.passed ? "bg-success-soft text-success" : "bg-warning-soft text-warning")}>
            {result.score} 点 —{" "}
            {result.passed
              ? "合格です。各問の解説を確認し、下の「学習完了にする」を押しましょう。"
              : "合格ラインに届きませんでした。不正解の問題に関係する本文を読み直して、もう一度挑戦しましょう (正解と解説は合格すると表示されます)。"}
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
