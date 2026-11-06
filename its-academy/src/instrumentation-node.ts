import { checkEnvironment } from "@/lib/env-check";

/**
 * Node.js ランタイムでの起動時確認 (instrumentation.ts から読み込む)。
 * 必須の設定が不足していればログを 1 行出して終了する。
 * 例外を投げるだけでは Next.js がプロセスを残し全リクエストに 500 を返し続けるため、終了させる。
 * コンテナの再起動方針・監視で「起動しない」ことが検知できる。
 */
export function verifyConfiguration() {
  if (process.env.NEXT_PHASE === "phase-production-build") return; // ビルド中は確認しない
  const problems = checkEnvironment(process.env);
  if (problems.length > 0) {
    console.error(JSON.stringify({ level: "fatal", event: "config_invalid", problems }));
    process.exit(1);
  }
}
