import { execSync } from "node:child_process";
import { TEST_DATABASE_URL } from "../../playwright.config";

/** テスト用 DB を最新のスキーマにして、初期データを入れ直す */
export default function globalSetup() {
  const env = { ...process.env, DATABASE_URL: TEST_DATABASE_URL };
  execSync("npx prisma migrate deploy", { env, stdio: "inherit" });
  execSync("npx tsx prisma/seed.ts", { env, stdio: "inherit" });
}
