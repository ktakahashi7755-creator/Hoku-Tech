"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cx } from "./ui";

export type NavItem = { href: string; label: string; exact?: boolean };

export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  // 右に続きのメニューがあるときだけ右端を薄くし、横にスクロールできることを示す (端まで動かしたら消す)
  const ref = useRef<HTMLElement>(null);
  const [more, setMore] = useState(false);
  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    const measure = () => setMore(nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 1);
    const observer = new ResizeObserver(measure); // 最初の 1 回も、ここで測られる
    observer.observe(nav);
    nav.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      nav.removeEventListener("scroll", measure);
    };
  }, []);
  return (
    <nav
      ref={ref}
      aria-label="メインメニュー"
      className={cx("mx-auto max-w-6xl overflow-x-auto px-2", more && "[mask-image:linear-gradient(to_right,black_85%,transparent)]")}
    >
      <ul className="flex gap-1">
        {items.map((item) => {
          const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "inline-flex min-h-11 items-center whitespace-nowrap border-b-2 px-3 text-sm",
                  active ? "border-accent font-semibold text-accent-strong" : "border-transparent text-muted hover:text-text",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
