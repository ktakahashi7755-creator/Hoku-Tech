import Link from "next/link";
import { cloneElement, isValidElement, type ComponentProps, type ReactNode } from "react";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";
const buttonStyles = {
  primary: cx(buttonBase, "bg-accent text-white hover:bg-accent-strong"),
  secondary: cx(buttonBase, "border border-border bg-bg text-text hover:bg-surface"),
  danger: cx(buttonBase, "bg-danger text-white hover:opacity-90"),
  ghost: cx(buttonBase, "text-accent hover:bg-accent-soft"),
};

export function Button({ variant = "primary", className, ...props }: ComponentProps<"button"> & { variant?: keyof typeof buttonStyles }) {
  return <button className={cx(buttonStyles[variant], className)} {...props} />;
}

export function ButtonLink({ variant = "primary", className, ...props }: ComponentProps<typeof Link> & { variant?: keyof typeof buttonStyles }) {
  return <Link className={cx(buttonStyles[variant], className)} {...props} />;
}

const cardTone = {
  default: "border-border bg-bg",
  muted: "border-border bg-surface",
  accent: "border-accent/40 bg-accent-soft",
  warning: "border-warning/50 bg-bg",
};

export function Card({ className, tone = "default", ...props }: ComponentProps<"section"> & { tone?: keyof typeof cardTone }) {
  return <section className={cx("rounded-xl border p-5", cardTone[tone], className)} {...props} />;
}

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

const badgeTone = {
  neutral: "bg-surface-2 text-text",
  accent: "bg-accent-soft text-accent-strong",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
};

export function Badge({ tone = "neutral", children }: { tone?: keyof typeof badgeTone; children: ReactNode }) {
  return <span className={cx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap", badgeTone[tone])}>{children}</span>;
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-semibold tabular-nums">{v}%</span>
      </div>
      <div role="progressbar" aria-label={label} aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} className="h-2 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-accent" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-dashed border-border p-6 text-center text-muted">{children}</p>;
}

/**
 * ラベル・補足・エラーつきの入力欄。補足とエラーを aria-describedby で入力欄に結び付け、
 * スクリーンリーダーでも「何を入力するか」「どこが間違っているか」が読み上げられるようにする。
 */
export function Field({ label, htmlFor, hint, error, children }: { label: string; htmlFor: string; hint?: string; error?: string; children: ReactNode }) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;
  const control = isValidElement<{ "aria-describedby"?: string; "aria-invalid"?: boolean }>(children)
    ? cloneElement(children, { "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })
    : children;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
      </label>
      {control}
      {hint && (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputStyles =
  "min-h-11 w-full rounded-lg border border-border bg-bg px-3 py-2 text-base text-text placeholder:text-muted focus:border-accent";

export function Skeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      <span className="sr-only">読み込み中</span>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-5 rounded bg-surface-2" style={{ width: `${90 - i * 12}%` }} />
      ))}
    </div>
  );
}

/**
 * 横にスクロールする領域。キーボードでもスクロールできるよう、フォーカス可能な名前付きの領域にする
 * (WCAG 2.1.1 / axe: scrollable-region-focusable)。
 * relative にして、中の絶対配置の要素 (sr-only のラベルなど) もこの領域で切り取る
 * (付けないと WebKit ではページ全体が横にスクロールする。E2E 06-hardening で検出)
 */
export function ScrollRegion({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div role="region" aria-label={label} tabIndex={0} className={cx("relative overflow-x-auto", className)}>
      {children}
    </div>
  );
}
