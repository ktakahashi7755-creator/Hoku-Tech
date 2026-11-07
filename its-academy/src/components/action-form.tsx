"use client";

import { startTransition, useEffect, useRef, type FormEvent, type FormHTMLAttributes, type ReactNode } from "react";

type Props = Omit<FormHTMLAttributes<HTMLFormElement>, "action" | "onSubmit"> & {
  /** useActionState が返す action */
  action: (formData: FormData) => void;
  /** useActionState の state。成功 (ok) したときに入力欄を空に戻す場合に使う */
  state?: { ok?: string } | undefined;
  resetOnSuccess?: boolean;
  /**
   * 送信前の確認文。押されたボタン (submitter) とフォームを受け取り、確認が不要なら null、
   * 送信を取りやめる (入力の誤りを先に知らせた) 場合は false を返す。取り消せない操作 (提出・採点の確定・退校など) で使う
   */
  confirm?: string | ((submitter: HTMLElement | null, form: HTMLFormElement) => string | null | false);
  children: ReactNode;
};

/**
 * サーバーアクションのフォーム。
 * React 19 の `<form action>` は送信が終わると入力欄を初期値に戻すため、エラーで戻ってきたときに
 * 書いた内容 (提出のコード・採点コメントなど) が消えてしまう。送信を onSubmit で行い、入力を保つ。
 */
export function ActionForm({ action, state, resetOnSuccess = false, confirm, children, ...props }: Props) {
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (resetOnSuccess && state?.ok) ref.current?.reset();
  }, [state, resetOnSuccess]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const submitter = (e.nativeEvent as SubmitEvent).submitter;
    // 入力の誤り (必須・文字数・形式) は、取り消せない操作の確認より先に知らせる
    if (!form.reportValidity()) return;
    const message = typeof confirm === "function" ? confirm(submitter, form) : confirm;
    if (message === false) return;
    if (message && !window.confirm(message)) return;
    // 押されたボタンの name / value (例: intent=submit) も送る
    const formData = new FormData(form, submitter);
    startTransition(() => action(formData));
  }

  return (
    <form ref={ref} onSubmit={onSubmit} {...props}>
      {children}
    </form>
  );
}

/**
 * 入力欄に誤りのメッセージを出して、その欄へ移動する (ブラウザ標準の表示)。入力し直すと消える。
 * 確認ダイアログの前に、提出時だけ必要なチェック (必須など) を行うために使う。
 */
export function reportFieldError(form: HTMLFormElement, name: string, message: string): false {
  const field = form.elements.namedItem(name);
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
    field.setCustomValidity(message);
    field.reportValidity();
    field.addEventListener("input", () => field.setCustomValidity(""), { once: true });
    field.addEventListener("change", () => field.setCustomValidity(""), { once: true });
  }
  return false;
}
