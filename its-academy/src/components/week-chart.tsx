/** 直近 7 日間の学習時間 (分)。表としても読めるよう、数値をテキストで併記する */
export function WeekChart({ week }: { week: { day: string; minutes: number }[] }) {
  const max = Math.max(60, ...week.map((w) => w.minutes));
  return (
    <figure>
      <figcaption className="sr-only">直近 7 日間の学習時間</figcaption>
      <ol className="grid grid-cols-7 items-end gap-2" style={{ height: 120 }}>
        {week.map((w) => (
          <li key={w.day} className="flex h-full flex-col items-center justify-end gap-1">
            <span className="text-xs tabular-nums text-muted">{w.minutes}</span>
            <span className="w-full rounded-t bg-accent" style={{ height: `${(w.minutes / max) * 80}%`, minHeight: w.minutes ? 4 : 0 }} aria-hidden />
            <span className="text-xs text-muted">{w.day.slice(5).replace("-", "/")}</span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-xs text-muted">単位: 分</p>
    </figure>
  );
}
