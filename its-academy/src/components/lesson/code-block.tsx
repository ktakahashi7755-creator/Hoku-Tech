"use client";

import { useState } from "react";
import { ScrollRegion } from "@/components/ui";
import { Icon } from "@/components/icons";

/**
 * 行番号は見た目だけの列 (aria-hidden) としてコードの外に置く。
 * コピーや読み上げにはコードだけが入り、横スクロールしても行番号は左に残る。
 */
function LineNumbers({ text }: { text: string }) {
  const count = text.replace(/\n$/, "").split("\n").length;
  return (
    <div aria-hidden="true" className="shrink-0 select-none border-r border-border py-4 pr-3 pl-4 text-right font-mono text-sm leading-relaxed text-muted tabular-nums">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  );
}

export function CodeBlock({ code, language, filename, label = "サンプルコード" }: { code: string; language: string; filename?: string; label?: string }) {
  const [copied, setCopied] = useState<"ok" | "failed" | null>(null);
  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-bg shadow-card">
      <figcaption className="flex items-center justify-between gap-2 border-b border-border bg-surface px-4 py-2 text-sm">
        {/* 長いファイル名でもコピーボタンが画面外に出ないよう、名前の側を折り返す */}
        <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 break-all">
          <Icon name="code" className="size-4 shrink-0 text-accent" />
          <span className="font-semibold">{label}</span>
          {filename && <span className="font-mono text-muted">{filename}</span>}
          <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-xs font-semibold text-muted">{language}</span>
        </span>
        <button
          type="button"
          className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-bg px-2.5 text-accent hover:bg-accent-soft"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setCopied("ok");
            } catch {
              // HTTP 接続やブラウザの設定でクリップボードが使えない場合
              setCopied("failed");
            }
            setTimeout(() => setCopied(null), 3000);
          }}
        >
          <Icon name={copied === "ok" ? "check" : "copy"} className="size-4" />
          <span aria-live="polite">{copied === "ok" ? "コピーしました" : copied === "failed" ? "コピーできません。選択してコピーしてください" : "コピー"}</span>
        </button>
      </figcaption>
      <div className="flex bg-code">
        <LineNumbers text={code} />
        <ScrollRegion label={`${label}${filename ? ` ${filename}` : ""}`} className="min-w-0 flex-1">
          <pre className="p-4 text-sm leading-relaxed">
            <code className="font-mono">{code}</code>
          </pre>
        </ScrollRegion>
      </div>
    </figure>
  );
}

export function OutputBlock({ output }: { output: string }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-output bg-output shadow-card">
      <figcaption className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-sm font-semibold text-output-text">
        <Icon name="terminal" className="size-4 text-output-muted" />
        実行結果
      </figcaption>
      <ScrollRegion label="実行結果">
        <pre className="p-4 text-sm leading-relaxed text-output-text">
          <samp className="font-mono">{output}</samp>
        </pre>
      </ScrollRegion>
    </figure>
  );
}
