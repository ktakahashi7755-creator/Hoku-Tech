"use client";

import { useActionState, useState, useTransition } from "react";
import { startReview, submitReview } from "@/app/actions/staff";
import { ActionForm, reportFieldError } from "@/components/action-form";
import { Button, Field, FormMessage, inputStyles } from "@/components/ui";
import { NETWORK_ERROR, withNetworkFallback } from "@/lib/safe-action";
import { DECISION_LABEL } from "@/lib/labels";

type Criterion = { key: string; label: string; weight: number; description: string };

export function StartReviewButton({ submissionId }: { submissionId: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="secondary"
        disabled={pending}
        onClick={() =>
          start(async () => {
            setError(null);
            try {
              await startReview(submissionId);
            } catch {
              setError("状態を変更できませんでした。ページを再読み込みしてください。");
            }
          })
        }
      >
        {pending ? "変更しています…" : "レビューを開始する (状態を「レビュー中」にする)"}
      </Button>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
    </div>
  );
}

export function ReviewForm({ submissionId, criteria, passScore }: { submissionId: string; criteria: Criterion[]; passScore: number }) {
  const [state, action, pending] = useActionState(withNetworkFallback(submitReview, { error: NETWORK_ERROR }), undefined);
  const [scores, setScores] = useState<Record<string, number>>(Object.fromEntries(criteria.map((c) => [c.key, 0])));
  const [decisionError, setDecisionError] = useState<string | null>(null);
  const total = criteria.reduce((s, c) => s + Math.min(Math.max(scores[c.key] || 0, 0), c.weight), 0);
  // 判定は、講師が選ぶまでは合計点から提案する。選んだ後は、点数を変えても勝手に切り替えない (知らないうちに結果が変わらないように)
  const [chosen, setChosen] = useState<string | null>(null);
  const decision = chosen ?? (total >= passScore ? "PASS" : "CHANGES_REQUESTED");
  const over = criteria.filter((c) => (scores[c.key] || 0) > c.weight);
  return (
    <ActionForm
      action={action}
      state={state}
      className="flex flex-col gap-4"
      onChange={() => setDecisionError(null)}
      confirm={(_submitter, form) => {
        setDecisionError(null);
        // 確定できない入力は、確認ダイアログより先に知らせる
        if (new FormData(form).get("decision") === "PASS" && total < passScore) {
          const message = `合計 ${total} 点は合格点 ${passScore} 点に届いていません。修正依頼または不合格を選んでください。`;
          setDecisionError(message);
          return reportFieldError(form, "decision", message);
        }
        const label = DECISION_LABEL[decision as keyof typeof DECISION_LABEL] ?? decision;
        return `判定「${label}」・合計 ${total} 点 (合格点 ${passScore} 点) で採点を確定します。後から変更できません。受講生に結果が通知されます。確定しますか?`;
      }}
    >
      <input type="hidden" name="submissionId" value={submissionId} />
      {criteria.map((c) => (
        <Field key={c.key} label={`${c.label} (0〜${c.weight})`} htmlFor={`score_${c.key}`} hint={c.description} error={state?.fieldErrors?.[`score_${c.key}`]}>
          <input
            id={`score_${c.key}`}
            name={`score_${c.key}`}
            type="number"
            min={0}
            max={c.weight}
            required
            value={scores[c.key]}
            onChange={(e) => setScores((s) => ({ ...s, [c.key]: Number(e.target.value) }))}
            className={`${inputStyles} max-w-32`}
          />
        </Field>
      ))}
      <p className="rounded-lg bg-surface p-3 font-semibold tabular-nums" aria-live="polite">
        合計 {total} / 100 点 (合格点 {passScore} 点)
        {over.length > 0 && <span className="block text-sm text-danger">配点を超えている観点があります: {over.map((c) => `${c.label} (最大 ${c.weight})`).join("、")}</span>}
      </p>
      <Field label="判定" htmlFor="decision" error={decisionError ?? undefined}>
        <select id="decision" name="decision" className={inputStyles} value={decision} onChange={(e) => setChosen(e.target.value)}>
          <option value="PASS">合格</option>
          <option value="CHANGES_REQUESTED">修正依頼</option>
          <option value="FAIL">不合格</option>
        </select>
      </Field>
      <Field label="コメント (受講生に表示されます)" htmlFor="comment" hint="良かった点と、次に何を直せばよいかを具体的に書いてください (10〜5,000 文字)。" error={state?.fieldErrors?.comment}>
        <textarea id="comment" name="comment" rows={6} className={inputStyles} required minLength={10} maxLength={5000} />
      </Field>
      <FormMessage state={state} />
      <Button type="submit" disabled={pending}>{pending ? "確定しています…" : "採点を確定する"}</Button>
    </ActionForm>
  );
}
