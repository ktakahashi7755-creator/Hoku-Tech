import { describe, expect, it } from "vitest";
import { checkEnvironment } from "@/lib/env-check";
import { securityHeaders } from "@/lib/security-headers";

describe("checkEnvironment", () => {
  it("開発環境は DATABASE_URL があれば問題なし", () => {
    expect(checkEnvironment({ NODE_ENV: "development", DATABASE_URL: "postgresql://its:x@localhost:5432/its" })).toEqual([]);
  });
  it("DATABASE_URL がない・形式が違う", () => {
    expect(checkEnvironment({})).toContain("DATABASE_URL が設定されていません");
    expect(checkEnvironment({ DATABASE_URL: "mysql://x" })[0]).toMatch(/postgresql/);
  });
  it("本番 (APP_ENV 未設定の NODE_ENV=production を含む) では HTTPS の Cookie と開発用以外のパスワードを求める", () => {
    const p = checkEnvironment({ NODE_ENV: "production", DATABASE_URL: "postgresql://its:its_dev_only@db:5432/its" });
    expect(p.some((m) => m.includes("COOKIE_SECURE"))).toBe(true);
    expect(p.some((m) => m.includes("開発用"))).toBe(true);
    expect(checkEnvironment({ NODE_ENV: "production", COOKIE_SECURE: "true", TRUSTED_PROXY_HOPS: "1", DATABASE_URL: "postgresql://app:Strong-Random-1@db:5432/its" })).toEqual([]);
    expect(checkEnvironment({ NODE_ENV: "production", COOKIE_SECURE: "true", DATABASE_URL: "postgresql://app:Strong-Random-1@db:5432/its" })[0]).toMatch(/TRUSTED_PROXY_HOPS/);
  });
  it("E2E など本番ビルドの試験は APP_ENV=test を明示したときだけ緩める", () => {
    expect(checkEnvironment({ NODE_ENV: "production", APP_ENV: "test", DATABASE_URL: "postgresql://its:its_dev_only@localhost/its" })).toEqual([]);
    expect(checkEnvironment({ APP_ENV: "prod", DATABASE_URL: "postgresql://x" })[0]).toMatch(/APP_ENV/);
  });
  it("Cloud SQL の Unix ソケット形式の接続文字列を受け付け、TRUSTED_PROXY_HOPS は 1 以上の整数だけ", () => {
    const base = { NODE_ENV: "production", COOKIE_SECURE: "true", TRUSTED_PROXY_HOPS: "1", DATABASE_URL: "postgresql://app:Strong-Random-1@localhost/its?host=/cloudsql/proj:asia-northeast1:its-db" };
    expect(checkEnvironment(base)).toEqual([]);
    expect(checkEnvironment({ ...base, TRUSTED_PROXY_HOPS: "0" })[0]).toMatch(/TRUSTED_PROXY_HOPS/);
  });
  it("メッセージに接続文字列 (パスワード) を含めない", () => {
    const p = checkEnvironment({ NODE_ENV: "production", DATABASE_URL: "postgresql://its:its_dev_only@db/its" });
    expect(p.join(" ")).not.toContain("its_dev_only");
  });
});

describe("securityHeaders", () => {
  it("本番 (HTTPS) では HSTS と upgrade-insecure-requests を付け、eval を許可しない", () => {
    const h = Object.fromEntries(securityHeaders({ dev: false, secure: true }).map((x) => [x.key, x.value]));
    expect(h["Strict-Transport-Security"]).toContain("max-age=31536000");
    expect(h["Content-Security-Policy"]).toContain("upgrade-insecure-requests");
    expect(h["Content-Security-Policy"]).not.toContain("unsafe-eval");
    expect(h["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
    expect(h["X-Frame-Options"]).toBe("DENY");
  });
  it("HTTP の検証環境では HSTS を付けない", () => {
    expect(securityHeaders({ dev: false, secure: false }).some((x) => x.key === "Strict-Transport-Security")).toBe(false);
  });
});
