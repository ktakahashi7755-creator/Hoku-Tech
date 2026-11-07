"use client";

import Link from "next/link";
import { useActionState } from "react";
import { changePassword } from "@/app/actions/auth";
import { ActionForm } from "@/components/action-form";
import { Button, Field, FormMessage, inputStyles } from "@/components/ui";

export function PasswordForm({ homeHref }: { homeHref: string }) {
  const [state, action, pending] = useActionState(changePassword, undefined);
  return (
    <ActionForm action={action} state={state} resetOnSuccess className="flex flex-col gap-4">
      <Field label="現在のパスワード" htmlFor="current" hint="初回は、講師・管理者から受け取ったパスワードです。" error={state?.fieldErrors?.current}>
        <input id="current" name="current" type="password" autoComplete="current-password" className={inputStyles} />
      </Field>
      <Field label="新しいパスワード" htmlFor="next" hint="12 文字以上。ほかのサービスと同じものは使わないでください。" error={state?.fieldErrors?.next}>
        <input id="next" name="next" type="password" autoComplete="new-password" className={inputStyles} />
      </Field>
      <Field label="新しいパスワード (確認)" htmlFor="confirm" error={state?.fieldErrors?.confirm}>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" className={inputStyles} />
      </Field>
      <FormMessage
        state={state}
        okExtra={
          <Link href={homeHref} className="font-semibold underline">
            ホームへ進む
          </Link>
        }
      />
      <Button type="submit" disabled={pending}>{pending ? "変更しています…" : "変更する"}</Button>
    </ActionForm>
  );
}
