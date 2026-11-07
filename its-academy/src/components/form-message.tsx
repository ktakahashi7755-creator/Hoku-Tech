"use client";

import { useEffect, useRef, type ReactNode } from "react";

type MessageState = { ok?: string; error?: string; errors?: string[] } | null | undefined;

/**
 * フォームの結果の表示 (成功・エラー・複数のエラー)。
 * - 読み上げ: 成功は role="status"、エラーは role="alert" の領域で 1 回だけ知らせる (領域は常に置いておく)
 * - フォーカス: 送信中にボタンが無効になるなどしてフォーカスが失われた場合は、結果のメッセージへ移す
 *   (次の Tab が画面の先頭からやり直しにならないように)
 */
export function FormMessage({ state, okExtra }: { state?: MessageState; okExtra?: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!state || (!state.ok && !state.error && !state.errors?.length)) return;
    const active = document.activeElement;
    if (!active || active === document.body) box.current?.focus({ preventScroll: false });
  }, [state]);
  return (
    <div ref={box} tabIndex={-1} className="outline-none">
      <div role="status">
        {state?.ok && (
          <p className="rounded-lg bg-success-soft p-3 text-sm text-success">
            {state.ok}
            {okExtra && <> {okExtra}</>}
          </p>
        )}
      </div>
      <div role="alert">
        {state?.error && <p className="rounded-lg bg-danger-soft p-3 text-sm text-danger">{state.error}</p>}
        {state?.errors && state.errors.length > 0 && (
          <ul className="list-disc rounded-lg bg-danger-soft p-3 pl-7 text-sm text-danger">
            {state.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
