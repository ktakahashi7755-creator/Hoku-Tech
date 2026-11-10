import type { SVGProps } from "react";

/**
 * 画面で使う線画アイコン (このサービス用に描いたもの。外部のアイコン集は使わない)。
 * 飾りとして使うため、既定で読み上げの対象から外す (aria-hidden)。意味を伝える場合は、必ず隣に文字を置く。
 */
const PATHS = {
  home: "M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z",
  book: "M5 5.5A1.5 1.5 0 0 1 6.5 4H12v15H6.5A1.5 1.5 0 0 0 5 20.5zM19 5.5A1.5 1.5 0 0 0 17.5 4H12v15h5.5a1.5 1.5 0 0 1 1.5 1.5zM5 20.5V5.5M19 20.5V5.5",
  clipboard: "M9 4.5h6M9 4.5a1.5 1.5 0 0 0 0 3h6a1.5 1.5 0 0 0 0-3M9 4.5H7A1.5 1.5 0 0 0 5.5 6v13A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V6A1.5 1.5 0 0 0 17 4.5h-2M9 12h6M9 16h4",
  chart: "M5 20V13M10 20V8M15 20v-9M20 20V5M3.5 20h17",
  message: "M5 5.5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-4 3.5v-3.5H5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zM8.5 10h7M8.5 13h4.5",
  user: "M12 12a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5zM5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5",
  grid: "M5 5h5.5v5.5H5zM13.5 5H19v5.5h-5.5zM5 13.5h5.5V19H5zM13.5 13.5H19V19h-5.5z",
  users: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M16 5.5a3 3 0 0 1 0 5.5M17.5 14.6c1.6.5 2.7 2 3 4.4",
  layers: "M12 4 3.5 8.5 12 13l8.5-4.5zM3.5 12.5 12 17l8.5-4.5M3.5 16.5 12 21l8.5-4.5",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M6 18l1.6-1.6M16.4 7.6 18 6",
  logout: "M14 4.5H6.5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1H14M10 12h10M16.5 8.5 20 12l-3.5 3.5",
  check: "m5 12.5 4.5 4.5L19 7.5",
  clock: "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM12 7.5V12l3 2",
  target: "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01",
  list: "M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01",
  bulb: "M9.5 17.5h5M10 20.5h4M12 3.5a5.5 5.5 0 0 0-3.2 10c.5.4.7.9.7 1.5v.5h5V15c0-.6.2-1.1.7-1.5A5.5 5.5 0 0 0 12 3.5z",
  code: "m8.5 7.5-4.5 4.5 4.5 4.5M15.5 7.5l4.5 4.5-4.5 4.5M13.5 5l-3 14",
  terminal: "M4.5 5h15a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM7.5 9.5 10 12l-2.5 2.5M12.5 15h4",
  pencil: "M15.5 5.5 18.5 8.5 9 18H6v-3zM13.5 7.5l3 3",
  quiz: "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM9.6 9.5a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 2-2.4 3.5M12 16.8h.01",
  briefcase: "M4.5 8h15a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM9 8V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3.5 13h17",
  alert: "M12 4 21 19.5H3zM12 10v4M12 16.8h.01",
  refresh: "M19.5 12a7.5 7.5 0 0 1-13.4 4.6M4.5 12a7.5 7.5 0 0 1 13.4-4.6M18 3.5v4h-4M6 20.5v-4h4",
  copy: "M9 9h10v11H9zM15 9V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4",
  chevronRight: "m9.5 6 6 6-6 6",
  chevronLeft: "m14.5 6-6 6 6 6",
  arrowRight: "M4.5 12h15M14 6.5l5.5 5.5-5.5 5.5",
  arrowLeft: "M19.5 12h-15M10 6.5 4.5 12l5.5 5.5",
  play: "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM10.2 8.8l5 3.2-5 3.2z",
  circle: "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17z",
  checkCircle: "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM8 12.3l2.7 2.7L16 9.5",
  lock: "M7 10.5h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1zM8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5",
  calendar: "M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM4 10.5h16M8.5 4v4M15.5 4v4",
  flame: "M12 20.5c3.3 0 6-2.4 6-5.8 0-3.6-2.7-5.4-3.6-8.7-.2-.7-1-.9-1.4-.3-1.1 1.6-1 3.4-1 4.3-1-.6-1.7-1.6-1.9-2.6-.1-.5-.7-.7-1.1-.3C7.6 8.6 6 10.9 6 14.7c0 3.4 2.7 5.8 6 5.8z",
  trophy: "M8 4.5h8v5a4 4 0 0 1-8 0zM8 6.5H5.5v1.5A3 3 0 0 0 8.5 11M16 6.5h2.5v1.5a3 3 0 0 1-3 3M12 13.5V17M8.5 20h7M9.5 17h5v3h-5z",
  inbox: "M4 13.5 6.5 5.5h11L20 13.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM4 13.5h4.5l1 2h5l1-2H20",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className = "size-5", ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className={className} {...props}>
      <path d={PATHS[name]} />
    </svg>
  );
}

/** ロゴマーク: 角丸の四角の中に、「P」と入力カーソルを組み合わせた形 (このサービス用のオリジナル) */
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" className={className}>
      <rect width="32" height="32" rx="8" fill="var(--accent)" />
      <path d="M10.5 24V8h6.5a5.2 5.2 0 0 1 0 10.4h-6.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* 入力を待つカーソルを表す小さな四角 */}
      <rect x="18.5" y="21.5" width="5.5" height="3" rx="1.5" fill="#fff" opacity="0.9" />
    </svg>
  );
}

/** ロゴ (マークと文字)。文字は画面に表示するテキストのため、読み上げもこの文字で行われる */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark className="size-8 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-bold tracking-wide text-text">PROVIDE</span>{" "}
        {!compact && <span className="mt-0.5 text-[10.5px] font-semibold tracking-[0.12em] text-accent">ENGINEER ACADEMY</span>}
        {compact && <span className="sr-only">ENGINEER ACADEMY</span>}
      </span>
    </span>
  );
}
