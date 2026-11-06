"use client";

import { useActionState } from "react";
import { changePassword } from "@/app/actions/auth";
import { Button, Field, inputStyles } from "@/components/ui";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, undefined);
  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="現在のパスワード" htmlFor="current" error={state?.fieldErrors?.current}>
        <input id="current" name="current" type="password" autoComplete="current-password" className={inputStyles} />
      </Field>
      <Field label="新しいパスワード" htmlFor="next" hint="12 文字以上。ほかのサービスと同じものは使わないでください。" error={state?.fieldErrors?.next}>
        <input id="next" name="next" type="password" autoComplete="new-password" className={inputStyles} />
      </Field>
      <Field label="新しいパスワード (確認)" htmlFor="confirm" error={state?.fieldErrors?.confirm}>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" className={inputStyles} />
      </Field>
      <div aria-live="polite">{state?.ok && <p className="rounded-lg bg-success-soft p-3 text-sm text-success">{state.ok}</p>}</div>
      <Button type="submit" disabled={pending}>変更する</Button>
    </form>
  );
}
