/**
 * すべての応答に付けるセキュリティヘッダー (next.config.ts から使う)。
 *
 * CSP: Partial Prerendering と nonce は両立しない (Next.js のドキュメント) ため、nonce を使わない構成にしている。
 * インラインスクリプトは許可するが、外部のスクリプト・プラグイン・フレームへの埋め込みを禁止し、
 * 通信・画像・フォームの送信先を自分のサイトに限定する (情報の持ち出し経路をふさぐ)。
 * XSS の主な対策は React のエスケープ (dangerouslySetInnerHTML を使わない) で行う。
 */
export function securityHeaders({ dev, secure }: { dev: boolean; secure: boolean }) {
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(secure ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
  return [
    { key: "Content-Security-Policy", value: csp },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
    ...(secure ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }] : []),
  ];
}
