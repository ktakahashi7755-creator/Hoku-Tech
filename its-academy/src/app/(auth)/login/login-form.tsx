"use client";

import { useActionState, useEffect, useRef, useSyncExternalStore } from "react";
import { login } from "@/app/actions/auth";
import { Button, Field, inputStyles } from "@/components/ui";
import { NETWORK_ERROR, withNetworkFallback } from "@/lib/safe-action";

export function LoginForm() {
  const [state, action, pending] = useActionState(withNetworkFallback(login, { error: NETWORK_ERROR }), undefined);
  // ログイン前に開こうとしていたページ (?next=)。戻り先として正しいかはサーバーで確かめる
  const next = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get("next") ?? "",
    () => "",
  );
  // 失敗したら、直す場所へフォーカスを移す (入力の誤りはその欄、メールアドレスかパスワードの誤りはパスワード欄)。
  // 送信中にボタンが無効になり、フォーカスが画面の先頭に戻ってしまうため
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!state || !form.current) return;
    const target = form.current.querySelector<HTMLInputElement>('[aria-invalid="true"]') ?? (state.error ? form.current.querySelector<HTMLInputElement>("#password") : null);
    target?.focus();
  }, [state]);
  return (
    <form ref={form} action={action} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="next" value={next} />
      {state?.error && (
        <p role="alert" className="rounded-lg bg-danger-soft p-3 text-sm text-danger">
          {state.error}
        </p>
      )}
      <Field label="メールアドレス (または ID)" htmlFor="email" error={state?.fieldErrors?.email}>
        <input id="email" name="email" type="text" autoCapitalize="none" autoComplete="username" required defaultValue={state?.values?.email} className={inputStyles} />
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
