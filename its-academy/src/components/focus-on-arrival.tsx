"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * 画面が切り替わったときに、フォーカスが行き場を失っていれば (ログイン直後など、押したボタンが消えた場合)
 * ページの見出しへ移す。スクリーンリーダーやキーボードの利用者が「今どの画面の先頭にいるか」を見失わないため。
 * リンクを押して移動した場合は、フォーカスがそのリンクに残っているので動かさない (Next.js が画面名を読み上げる)。
 * ページを直接開いた・再読み込みした場合は動かさない (最初の Tab で「本文へスキップ」に届くようにする)。
 */
export function FocusOnArrival() {
  const pathname = usePathname();
  const firstRun = useRef(true);
  useEffect(() => {
    const isFirstRun = firstRun.current;
    firstRun.current = false;
    if (isFirstRun && pathname === documentPathname()) return; // ブラウザが読み込んだページそのもの (画面内の移動ではない)
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

/** ブラウザが最初に読み込んだページの URL のパス (画面内の移動では変わらない) */
function documentPathname(): string | null {
  const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  return entry ? new URL(entry.name).pathname : null;
}
