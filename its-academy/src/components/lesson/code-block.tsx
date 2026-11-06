"use client";

import { useState } from "react";

export function CodeBlock({ code, language, filename, label = "サンプルコード" }: { code: string; language: string; filename?: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <figure className="overflow-hidden rounded-xl border border-border">
      <figcaption className="flex items-center justify-between gap-2 border-b border-border bg-surface px-4 py-2 text-sm">
        <span>
          <span className="font-semibold">{label}</span>
          {filename && <span className="ml-2 font-mono text-muted">{filename}</span>}
          <span className="ml-2 text-xs text-muted">{language}</span>
        </span>
        <button
          type="button"
          className="min-h-9 rounded-md px-2 text-accent hover:bg-accent-soft"
          onClick={async () => {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          {copied ? "コピーしました" : "コピー"}
        </button>
      </figcaption>
      <pre className="overflow-x-auto bg-code p-4 text-sm leading-relaxed">
        <code className="font-mono">{code}</code>
      </pre>
    </figure>
  );
}

export function OutputBlock({ output }: { output: string }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border">
      <figcaption className="border-b border-border bg-surface px-4 py-2 text-sm font-semibold">実行結果</figcaption>
      <pre className="overflow-x-auto bg-[#1c1f24] p-4 text-sm leading-relaxed text-[#e8eaed]">
        <samp className="font-mono">{output}</samp>
      </pre>
    </figure>
  );
}
