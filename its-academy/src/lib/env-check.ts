/**
 * 起動時の設定の確認 (純粋関数)。問題があればメッセージの一覧を返す。値そのもの (秘密情報) はメッセージに含めない。
 *
 * APP_ENV: production (既定) / staging / test / local。
 * NODE_ENV=production で APP_ENV が未設定のときは production として厳しく確認する (設定し忘れても安全側)。
 */
export function checkEnvironment(env: Record<string, string | undefined>): string[] {
  const problems: string[] = [];
  const appEnv = env.APP_ENV ?? (env.NODE_ENV === "production" ? "production" : "local");
  const url = env.DATABASE_URL;
  if (!["production", "staging", "test", "local"].includes(appEnv)) problems.push("APP_ENV は production / staging / test / local のいずれかにしてください");
  if (!url) problems.push("DATABASE_URL が設定されていません");
  else if (!/^postgres(ql)?:\/\//.test(url)) problems.push("DATABASE_URL は postgresql:// で始まる接続文字列にしてください");
  if (appEnv === "production" || appEnv === "staging") {
    if (env.COOKIE_SECURE !== "true") problems.push("本番・検証環境では HTTPS で運用し、COOKIE_SECURE=true を設定してください");
    if (url && /its_dev_only|ci_only_password|:postgres@|:password@/.test(url)) problems.push("DATABASE_URL に開発用・初期値のパスワードが使われています");
  }
  return problems;
}
