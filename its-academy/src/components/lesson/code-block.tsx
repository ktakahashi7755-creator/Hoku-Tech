"use client";

import { useState } from "react";
import { ScrollRegion } from "@/components/ui";

export function CodeBlock({ code, language, filename, label = "サンプルコード" }: { code: string; language: string; filename?: string; label?: string }) {
  const [copied, setCopied] = useState<"ok" | "failed" | null>(null);
  return (
    <figure className="overflow-hidden rounded-xl border border-border">
      <figcaption className="flex items-center justify-between gap-2 border-b border-border bg-surface px-4 py-2 text-sm">
        {/* 長いファイル名でもコピーボタンが画面外に出ないよう、名前の側を折り返す */}
        <span className="min-w-0 break-all">
          <span className="font-semibold">{label}</span>
          {filename && <span className="ml-2 font-mono text-muted">{filename}</span>}
          <span className="ml-2 text-xs text-muted">{language}</span>
        </span>
        <button
          type="button"
          className="min-h-9 shrink-0 rounded-md px-2 text-accent hover:bg-accent-soft"
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
          <span aria-live="polite">{copied === "ok" ? "コピーしました" : copied === "failed" ? "コピーできません。選択してコピーしてください" : "コピー"}</span>
        </button>
      </figcaption>
      <ScrollRegion label={`${label}${filename ? ` ${filename}` : ""}`} className="bg-code">
        <pre className="p-4 text-sm leading-relaxed">
          <code className="font-mono">{code}</code>
        </pre>
      </ScrollRegion>
    </figure>
  );
}

export function OutputBlock({ output }: { output: string }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border">
      <figcaption className="border-b border-border bg-surface px-4 py-2 text-sm font-semibold">実行結果</figcaption>
      <ScrollRegion label="実行結果" className="bg-[#1c1f24]">
        <pre className="p-4 text-sm leading-relaxed text-[#e8eaed]">
          <samp className="font-mono">{output}</samp>
        </pre>
      </ScrollRegion>
    </figure>
  );
}
