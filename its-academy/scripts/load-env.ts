import { existsSync } from "node:fs";

/**
 * 手元で実行するスクリプト用。its-academy/.env があれば読み込む (すでに設定されている環境変数は上書きしない)。
 * 本番 (コンテナ) には .env がないため、環境変数だけが使われる。
 */
export function loadLocalEnv(): void {
  if (existsSync(".env")) process.loadEnvFile(".env");
}
