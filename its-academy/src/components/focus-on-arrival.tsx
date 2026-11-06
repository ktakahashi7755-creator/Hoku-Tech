"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * 画面が切り替わったときに、フォーカスが行き場を失っていれば (ログイン直後など、押したボタンが消えた場合)
 * ページの見出しへ移す。スクリーンリーダーやキーボードの利用者が「今どの画面の先頭にいるか」を見失わないため。
 * リンクを押して移動した場合は、フォーカスがそのリンクに残っているので動かさない (Next.js が画面名を読み上げる)。
 */
export function FocusOnArrival() {
  const pathname = usePathname();
  useEffect(() => {
    let frame = 0;
    let tries = 0;
    const attempt = () => {
      const active = document.activeElement;
      if (active && active !== document.body) return; // 利用者のフォーカスがあるので何もしない
      // 直前の画面は非表示のまま DOM に残ることがある (Next.js が戻る操作のために保持する) ため、表示中の見出しを選ぶ
      const heading = [...document.querySelectorAll<HTMLElement>("main h1")].find((h) => h.getClientRects().length > 0);
      if (!heading) {
        // 本文は後から流れてくる (ストリーミング) ため、見出しが出るまで少し待つ
        if (tries++ < 120) frame = requestAnimationFrame(attempt);
        return;
      }
      if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    };
    frame = requestAnimationFrame(attempt);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  return null;
}
