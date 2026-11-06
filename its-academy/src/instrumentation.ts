import { checkEnvironment } from "@/lib/env-check";

/** サーバー起動時に 1 回呼ばれる。必須の設定が不足していれば起動を止める */
export function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return; // ビルド中は確認しない
  const problems = checkEnvironment(process.env);
  if (problems.length > 0) {
    console.error(JSON.stringify({ level: "fatal", event: "config_invalid", problems }));
    throw new Error(`設定に問題があります: ${problems.join(" / ")}`);
  }
}

/**
 * サーバー側のエラーを 1 行の JSON で記録する (ログ収集・監視サービスに渡しやすい形)。
 * 個人情報を残さないよう、URL のクエリ・Cookie・本文は記録しない。
 */
export async function onRequestError(
  err: unknown,
  request: { path: string; method: string },
  context: { routerKind: string; routePath: string; routeType: string },
) {
  const e = err instanceof Error ? err : new Error(String(err));
  console.error(
    JSON.stringify({
      level: "error",
      event: "request_error",
      time: new Date().toISOString(),
      method: request.method,
      path: request.path.split("?")[0],
      route: context.routePath,
      routeType: context.routeType,
      digest: typeof err === "object" && err !== null && "digest" in err ? String((err as { digest: unknown }).digest) : undefined,
      name: e.name,
      message: e.message.slice(0, 500),
    }),
  );
}
