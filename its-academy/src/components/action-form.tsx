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
export function ActionForm(allProps: Props) {
  const { action, state, resetOnSuccess = false, confirm, children, ...props } = allProps;
  // state を渡したフォームか (初めは undefined のため、値ではなく渡したかどうかで見分ける)
  const hasState = "state" in allProps;
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (resetOnSuccess && state?.ok) ref.current?.reset();
    // 送信の結果が届いたら、入力し直して隠した誤りの表示を戻す (同じ誤りが続いていれば再び見える。直っていれば React が消している)
    if (ref.current) restoreClearedErrors(ref.current);
  }, [state, resetOnSuccess]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const submitter = (e.nativeEvent as SubmitEvent).submitter;
    // 前回のボタンで出した誤りの表示 (reportFieldError) は、別のボタン (例: 下書き保存) を妨げないよう毎回消す
    for (const el of Array.from(form.elements)) {
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) el.setCustomValidity("");
    }
    // 入力の誤り (必須・文字数・形式) は、取り消せない操作の確認より先に知らせる。formNoValidate のボタン (下書き保存) は除く
    const skipValidation = submitter instanceof HTMLButtonElement && submitter.formNoValidate;
    if (!skipValidation && !form.reportValidity()) return;
    const message = typeof confirm === "function" ? confirm(submitter, form) : confirm;
    if (message === false) return;
    if (message && !window.confirm(message)) return;
    // state を受け取らないフォームでは、結果を知る方法がないため、送信の時点で隠した表示を戻す
    if (!hasState) restoreClearedErrors(form);
    // 押されたボタンの name / value (例: intent=submit) も送る
    const formData = new FormData(form, submitter);
    startTransition(() => action(formData));
  }

  return (
    <form ref={ref} onSubmit={onSubmit} onInput={clearFieldError} {...props}>
      {children}
    </form>
  );
}

/**
 * 入力欄を直したら、その欄の下に出ているサーバーからの誤りの表示 (Field の error) を隠す。
 * 隠さないと、ブラウザの入力チェックで送信が止まったときに、直した欄に古い誤りが残って見える
 */
function clearFieldError(e: FormEvent<HTMLFormElement>) {
  const el = e.target;
  if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) || !el.id) return;
  const message = document.getElementById(`${el.id}-error`);
  if (!message || message.hidden) return;
  message.hidden = true;
  el.removeAttribute("aria-invalid");
  el.dataset.errorCleared = "1";
}

function restoreClearedErrors(form: HTMLFormElement) {
  for (const el of Array.from(form.querySelectorAll<HTMLElement>("[data-error-cleared]"))) {
    delete el.dataset.errorCleared;
    el.setAttribute("aria-invalid", "true");
    const message = document.getElementById(`${el.id}-error`);
    if (message) message.hidden = false;
  }
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
