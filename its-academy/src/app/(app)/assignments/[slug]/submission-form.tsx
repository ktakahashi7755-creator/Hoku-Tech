"use client";

import { useActionState } from "react";
import { saveSubmission } from "@/app/actions/submissions";
import { ActionForm, reportFieldError } from "@/components/action-form";
import { GITHUB_REPO_URL } from "@/lib/validation";
import { Button, Field, FormMessage, inputStyles } from "@/components/ui";
import { submitsRepository } from "@/lib/validation";

export function SubmissionForm({ assignmentId, type, defaults }: { assignmentId: string; type: string; defaults: { text: string; repoUrl: string; note: string } }) {
  const [state, action, pending] = useActionState(saveSubmission, undefined);
  const repo = submitsRepository(type);
  return (
    <ActionForm
      action={action}
      className="flex flex-col gap-5"
      confirm={(submitter, form) => {
        if (submitter?.getAttribute("value") !== "submit") return null;
        // 提出のときだけ必要なチェックは、確認ダイアログより先に行う
        const data = new FormData(form);
        if (repo) {
          const url = String(data.get("repoUrl") ?? "").trim();
          if (!GITHUB_REPO_URL.test(url)) return reportFieldError(form, "repoUrl", "https://github.com/ユーザー名/リポジトリ名 の形式で入力してください");
        } else if (!String(data.get("text") ?? "").trim()) {
          return reportFieldError(form, "text", "提出内容を入力してください");
        }
        return "提出すると、講師のレビューが終わるまで内容を変更できません。提出しますか?";
      }}
    >
      <input type="hidden" name="assignmentId" value={assignmentId} />
      {repo ? (
        <Field label="GitHub リポジトリの URL" htmlFor="repoUrl" hint="例: https://github.com/your-name/its-profile" error={state?.fieldErrors?.repoUrl}>
          <input id="repoUrl" name="repoUrl" type="text" defaultValue={defaults.repoUrl} className={inputStyles} inputMode="url" maxLength={300} autoComplete="off" />
        </Field>
      ) : (
        <Field label="提出するコード・回答" htmlFor="text" error={state?.fieldErrors?.text}>
          <textarea id="text" name="text" defaultValue={defaults.text} rows={14} className={`${inputStyles} font-mono text-sm`} spellCheck={false} maxLength={100000} />
        </Field>
      )}
      <Field label="備考" htmlFor="note" hint="実行結果、工夫した点、AI を使った場合はどこで使ったかを書いてください。パスワードや API キーは書かないでください。" error={state?.fieldErrors?.note}>
        <textarea id="note" name="note" defaultValue={defaults.note} rows={4} className={inputStyles} maxLength={2000} />
      </Field>
      <FormMessage state={state} />
      <div className="flex flex-wrap gap-3">
        <Button type="submit" name="intent" value="submit" disabled={pending}>
          {pending ? "提出しています…" : "提出する"}
        </Button>
        <Button type="submit" name="intent" value="draft" variant="secondary" disabled={pending} formNoValidate>
          下書き保存
        </Button>
      </div>
    </ActionForm>
  );
}
