"use client";

import { useActionState, useState, useTransition } from "react";
import { startReview, submitReview } from "@/app/actions/staff";
import { Button, Field, inputStyles } from "@/components/ui";

type Criterion = { key: string; label: string; weight: number; description: string };

export function StartReviewButton({ submissionId }: { submissionId: string }) {
  const [pending, start] = useTransition();
  return (
    <Button variant="secondary" disabled={pending} onClick={() => start(() => startReview(submissionId))}>
      レビューを開始する (状態を「レビュー待ち」から着手中に)
    </Button>
  );
}

export function ReviewForm({ submissionId, criteria, passScore }: { submissionId: string; criteria: Criterion[]; passScore: number }) {
  const [state, action, pending] = useActionState(submitReview, undefined);
  const [scores, setScores] = useState<Record<string, number>>(Object.fromEntries(criteria.map((c) => [c.key, 0])));
  const total = criteria.reduce((s, c) => s + Math.min(Math.max(scores[c.key] || 0, 0), c.weight), 0);
  return (
    <form action={action} className="flex flex-col gap-4">
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
        合計 {total} / 100 点 (合格点 {passScore})
      </p>
      <Field label="判定" htmlFor="decision">
        <select id="decision" name="decision" className={inputStyles} defaultValue={total >= passScore ? "PASS" : "CHANGES_REQUESTED"} key={total >= passScore ? "p" : "c"}>
          <option value="PASS">合格</option>
          <option value="CHANGES_REQUESTED">修正依頼</option>
          <option value="FAIL">不合格</option>
        </select>
      </Field>
      <Field label="コメント (受講生に表示されます)" htmlFor="comment" hint="良かった点と、次に何を直せばよいかを具体的に書いてください。" error={state?.fieldErrors?.comment}>
        <textarea id="comment" name="comment" rows={6} className={inputStyles} />
      </Field>
      <div aria-live="polite">
        {state?.error && <p role="alert" className="rounded-lg bg-danger-soft p-3 text-sm text-danger">{state.error}</p>}
        {state?.ok && <p className="rounded-lg bg-success-soft p-3 text-sm text-success">{state.ok}</p>}
      </div>
      <Button type="submit" disabled={pending}>採点を確定する</Button>
    </form>
  );
}
