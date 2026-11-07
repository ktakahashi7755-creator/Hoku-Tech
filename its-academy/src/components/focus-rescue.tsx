"use client";

import { useEffect } from "react";

/**
 * 送信したフォームが結果の表示に置き換わった (提出・採点の確定の後など) ために、フォーカスが行き場を失ったとき、
 * 本文の結果のメッセージ (なければページの見出し) へ移す。次の Tab が画面の先頭からやり直しにならないように。
 * 利用者が自分で消した要素 (「削除」など type="button" のボタン) や、画面の余白のクリックでは動かさない。
 */
export function FocusRescue() {
  useEffect(() => {
    let last: Element | null = null;
    let lastPath = "";
    // フォームの外側の要素 (結果のメッセージは、置き換わったフォームの近くに出るため、そこから探す)
    let area: Element | null = null;
    let timer: number | undefined;
    const onFocusIn = (e: FocusEvent) => {
      last = e.target instanceof Element ? e.target : null;
      lastPath = location.pathname;
      area = last?.closest("form")?.parentElement ?? null;
    };
    const onFocusOut = (e: FocusEvent) => {
      if (e.relatedTarget) return;
      const target = e.target;
      // 画面の余白をクリックしてフォーカスを外した場合は、何もしない (ボタンが無効になった・消えた場合とは区別する)
      requestAnimationFrame(() => {
        const disabled = target instanceof HTMLButtonElement || target instanceof HTMLInputElement ? target.disabled : false;
        if (target === last && target instanceof Element && target.isConnected && !disabled) last = null;
      });
    };
    const rescue = () => {
      timer = undefined;
      const active = document.activeElement;
      if (!last || last.isConnected || (active && active !== document.body)) return;
      last = null;
      // 別の画面へ移動した場合は、FocusOnArrival (見出しへ移す) に任せる
      if (location.pathname !== lastPath) return;
      const visible = (el: Element) => el.getClientRects().length > 0;
      const messageIn = (root: ParentNode) => [...root.querySelectorAll<HTMLElement>('[role="status"], [role="alert"]')].find((el) => visible(el) && el.textContent?.trim());
      const main = document.querySelector("main");
      const message = (area?.isConnected ? messageIn(area) : undefined) ?? (main ? messageIn(main) : undefined);
      const target = message ?? [...document.querySelectorAll<HTMLElement>("main h1")].find(visible);
      if (!target) return;
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: !message });
    };
    const observer = new MutationObserver(() => {
      if (!last || last.isConnected || timer !== undefined) return;
      if (last instanceof HTMLButtonElement && last.type === "button") {
        last = null;
        return;
      }
      // 部品の側 (FormMessage など) がフォーカスを移すのを先に待つ
      timer = window.setTimeout(rescue, 150);
    });
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);
  return null;
}
