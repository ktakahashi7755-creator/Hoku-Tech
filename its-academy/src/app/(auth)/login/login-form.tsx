"use client";

import { useActionState, useSyncExternalStore } from "react";
import { login } from "@/app/actions/auth";
import { Button, Field, inputStyles } from "@/components/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  // ログイン前に開こうとしていたページ (?next=)。戻り先として正しいかはサーバーで確かめる
  const next = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get("next") ?? "",
    () => "",
  );
  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="next" value={next} />
      {state?.error && (
        <p role="alert" className="rounded-lg bg-danger-soft p-3 text-sm text-danger">
          {state.error}
        </p>
      )}
      <Field label="メールアドレス" htmlFor="email" error={state?.fieldErrors?.email}>
        <input id="email" name="email" type="email" autoComplete="email" required defaultValue={state?.values?.email} className={inputStyles} />
      </Field>
      <Field label="パスワード" htmlFor="password" error={state?.fieldErrors?.password}>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputStyles} />
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "確認しています…" : "ログイン"}
      </Button>
    </form>
  );
}
