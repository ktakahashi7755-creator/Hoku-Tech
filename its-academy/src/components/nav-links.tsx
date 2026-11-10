"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cx } from "./ui";
import { Icon, type IconName } from "./icons";

/** badge: 未読のお知らせの件数 (サーバー側でログイン中の本人の分だけを数えて渡す。0 なら印を出さない) */
export type NavItem = { href: string; label: string; exact?: boolean; badge?: number; icon?: IconName };

export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const isActive = (item: NavItem) => (item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/"));
  // お知らせを表示した画面では、その件数の印を消す (メニューは画面を移動しても読み込み直されないため、
  // 表示したときの件数を覚えておき、サーバーから届く件数が変わる (新しいお知らせ・再読み込み) まで出さない)
  const [seen, setSeen] = useState<Record<string, number>>({});
  for (const item of items) {
    if (item.badge && isActive(item) && seen[item.href] !== item.badge) setSeen({ ...seen, [item.href]: item.badge });
  }
  // 右に続きのメニューがあるときだけ右端を薄くし、横にスクロールできることを示す (端まで動かしたら消す)
  const ref = useRef<HTMLElement>(null);
  const [more, setMore] = useState(false);
  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    const measure = () => setMore(nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 1);
    const observer = new ResizeObserver(measure); // 最初の 1 回も、ここで測られる
    observer.observe(nav);
    if (nav.firstElementChild) observer.observe(nav.firstElementChild); // 中身の幅だけが変わった場合 (文字の読み込みなど)
    nav.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      nav.removeEventListener("scroll", measure);
    };
  }, []);
  // 狭い画面では、今いる画面のメニュー (右側の「質問・レビュー」「マイページ」など) が横にはみ出して見えないため、
  // 画面を開いたとき・移動したときに見える位置まで横にだけ動かす (フォーカスは動かさず、縦にも動かさない)
  useEffect(() => {
    const nav = ref.current;
    const link = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !link) return;
    const box = nav.getBoundingClientRect();
    const r = link.getBoundingClientRect();
    const fade = nav.clientWidth * 0.15; // 右端を薄くしている幅 (mask-image の 85% 以降) に重ならないようにする
    // 小数点以下の端数で数ピクセル欠けないよう切り上げる。最後のメニューなら右端まで動かす (ブラウザにより余白の扱いが違うため)
    if (r.left < box.left) nav.scrollLeft -= Math.ceil(box.left - r.left) + 8;
    else if (link.parentElement === link.closest("ul")?.lastElementChild) nav.scrollLeft = nav.scrollWidth;
    else if (r.right > box.right - fade) nav.scrollLeft += Math.ceil(r.right - (box.right - fade)) + 1;
  }, [pathname]);
  return (
    <nav
      ref={ref}
      aria-label="メインメニュー"
      className={cx("min-w-0 overflow-x-auto", more && "[mask-image:linear-gradient(to_right,black_85%,transparent)]")}
    >
      <ul className="flex gap-1 py-1 after:block after:w-2 after:shrink-0 after:content-[''] lg:after:hidden">
        {items.map((item) => {
          const active = isActive(item);
          const badge = item.badge && seen[item.href] !== item.badge ? item.badge : 0;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-xl px-3 text-sm transition-colors",
                  active ? "bg-accent-soft font-semibold text-accent-strong" : "text-muted hover:bg-surface hover:text-text",
                )}
              >
                {item.icon && <Icon name={item.icon} className="size-[18px] shrink-0" />}
                {item.label}
                {badge > 0 && (
                  <>
                    {/* 見た目は件数だけの印、読み上げでは「新着 N 件」と伝える */}
                    <span aria-hidden="true" className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold leading-5 text-white">
                      {badge > 99 ? "99+" : badge}
                    </span>
                    <span className="sr-only">{` (新着 ${badge} 件)`}</span>
                  </>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
