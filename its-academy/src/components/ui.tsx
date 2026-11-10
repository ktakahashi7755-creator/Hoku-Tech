import Link from "next/link";
import { cloneElement, isValidElement, type ComponentProps, type ReactNode } from "react";
import { Icon, type IconName } from "./icons";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";
const buttonStyles = {
  primary: cx(buttonBase, "bg-accent text-white shadow-card hover:bg-accent-strong"),
  secondary: cx(buttonBase, "border border-border-strong/60 bg-bg text-text hover:border-border-strong hover:bg-surface"),
  danger: cx(buttonBase, "bg-danger text-white hover:opacity-90"),
  ghost: cx(buttonBase, "text-accent hover:bg-accent-soft"),
  /** 濃い色の地 (次にやること など) の上に置くボタン */
  inverse: cx(buttonBase, "bg-white text-accent-strong shadow-card hover:bg-accent-soft"),
};

export function Button({ variant = "primary", className, ...props }: ComponentProps<"button"> & { variant?: keyof typeof buttonStyles }) {
  return <button className={cx(buttonStyles[variant], className)} {...props} />;
}

export function ButtonLink({ variant = "primary", className, ...props }: ComponentProps<typeof Link> & { variant?: keyof typeof buttonStyles }) {
  return <Link className={cx(buttonStyles[variant], className)} {...props} />;
}

const cardTone = {
  default: "border-border bg-bg shadow-card",
  muted: "border-border bg-surface",
  accent: "border-accent/30 bg-accent-soft",
  warning: "border-warning/50 bg-bg shadow-card",
};

export function Card({ className, tone = "default", ...props }: ComponentProps<"section"> & { tone?: keyof typeof cardTone }) {
  // min-w-0: グリッド・フレックスの中で、長い内容に押し広げられないようにする
  return <section className={cx("min-w-0 rounded-2xl border p-5 sm:p-6", cardTone[tone], className)} {...props} />;
}

/** カードの見出し。アイコンは飾り (見出しの文字で意味が伝わる) */
export function CardTitle({ icon, children, className }: { icon?: IconName; children: ReactNode; className?: string }) {
  return (
    <h2 className={cx("flex items-center gap-2.5 font-bold", className)}>
      {icon && (
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <Icon name={icon} className="size-[18px]" />
        </span>
      )}
      {children}
    </h2>
  );
}

export function PageHeader({ title, description, actions, eyebrow }: { title: string; description?: ReactNode; actions?: ReactNode; eyebrow?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-sm font-semibold text-accent">{eyebrow}</p>}
        <h1 className="text-2xl font-bold tracking-tight sm:text-[28px] sm:leading-tight">{title}</h1>
        {description && <p className="mt-2 max-w-3xl text-muted">{description}</p>}
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
  return <span className={cx("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap", badgeTone[tone])}>{children}</span>;
}

export function ProgressBar({ value, label, tone = "accent" }: { value: number; label: string; tone?: "accent" | "success" }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      <div className="mb-1.5 flex justify-between gap-3 text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-semibold tabular-nums">{v}%</span>
      </div>
      <div role="progressbar" aria-label={label} aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} className="h-2 overflow-hidden rounded-full bg-surface-2">
        <div className={cx("h-full rounded-full", tone === "success" ? "bg-success" : "bg-accent")} style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

export function Stat({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: ReactNode; icon?: IconName }) {
  return (
    <div className="flex min-w-0 flex-col rounded-2xl border border-border bg-bg p-5 shadow-card">
      <div className="flex items-center gap-2 text-sm text-muted">
        {icon && (
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <Icon name={icon} className="size-4" />
          </span>
        )}
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight tabular-nums">{value}</div>
      {hint && <div className="mt-1.5 text-xs leading-relaxed text-muted">{hint}</div>}
    </div>
  );
}

export function EmptyState({ children, icon = "inbox" }: { children: ReactNode; icon?: IconName }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-bg p-8 text-center text-muted">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-surface text-muted">
        <Icon name={icon} className="size-6" />
      </span>
      <p>{children}</p>
    </div>
  );
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
  "min-h-12 w-full rounded-xl border border-border-strong bg-bg px-4 py-2 text-base text-text placeholder:text-muted focus:border-accent";

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
export function ScrollRegion({ label, className, children, scrollHint = false }: { label: string; className?: string; children: ReactNode; scrollHint?: boolean }) {
  const region = (
    <div role="region" aria-label={label} tabIndex={0} className={cx("relative overflow-x-auto", className)}>
      {children}
    </div>
  );
  if (!scrollHint) return region;
  // 幅の広い表は、スマホでは一部の列が画面の外になるため、横に動かせることを伝える
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs text-muted sm:hidden" aria-hidden="true">
        表は横にスクロールできます →
      </p>
      {region}
    </div>
  );
}

export { FormMessage } from "./form-message";
