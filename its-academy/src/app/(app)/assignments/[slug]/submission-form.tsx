"use client";

import { useActionState } from "react";
import { saveSubmission } from "@/app/actions/submissions";
import { ActionForm } from "@/components/action-form";
import { Button, Field, inputStyles } from "@/components/ui";
import { submitsRepository } from "@/lib/validation";

export function SubmissionForm({ assignmentId, type, defaults }: { assignmentId: string; type: string; defaults: { text: string; repoUrl: string; note: string } }) {
  const [state, action, pending] = useActionState(saveSubmission, undefined);
  const repo = submitsRepository(type);
  return (
    <ActionForm
      action={action}
      className="flex flex-col gap-5"
      confirm={(submitter) =>
        submitter?.getAttribute("value") === "submit" ? "提出すると、講師のレビューが終わるまで内容を変更できません。提出しますか?" : null
      }
    >
      <input type="hidden" name="assignmentId" value={assignmentId} />
      {repo ? (
        <Field label="GitHub リポジトリの URL" htmlFor="repoUrl" hint="例: https://github.com/your-name/its-profile" error={state?.fieldErrors?.repoUrl}>
          <input id="repoUrl" name="repoUrl" type="url" defaultValue={defaults.repoUrl} className={inputStyles} inputMode="url" />
        </Field>
      ) : (
        <Field label="提出するコード・回答" htmlFor="text" error={state?.fieldErrors?.text}>
          <textarea id="text" name="text" defaultValue={defaults.text} rows={14} className={`${inputStyles} font-mono text-sm`} spellCheck={false} />
        </Field>
      )}
      <Field label="備考" htmlFor="note" hint="実行結果、工夫した点、AI を使った場合はどこで使ったかを書いてください。パスワードや API キーは書かないでください。" error={state?.fieldErrors?.note}>
        <textarea id="note" name="note" defaultValue={defaults.note} rows={4} className={inputStyles} />
      </Field>
      <div aria-live="polite">
        {state?.error && <p className="rounded-lg bg-danger-soft p-3 text-sm text-danger" role="alert">{state.error}</p>}
        {state?.ok && <p className="rounded-lg bg-success-soft p-3 text-sm text-success">{state.ok}</p>}
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" name="intent" value="submit" disabled={pending}>
          {pending ? "保存しています…" : "提出する"}
        </Button>
        <Button type="submit" name="intent" value="draft" variant="secondary" disabled={pending}>
          下書き保存
        </Button>
      </div>
    </ActionForm>
  );
}
