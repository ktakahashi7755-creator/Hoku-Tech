import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
export const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ?? "postgresql://its:its_dev_only@localhost:5432/its_academy_test";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false, // ファイル名の番号順に実行 (02-cms はレッスンの版を変更するため最後)
  workers: 1, // DB を共有するシナリオ試験のため直列に実行
  retries: 0,
  reporter: [["list"]],
  globalSetup: "./tests/e2e/global-setup.ts",
  use: { baseURL: `http://localhost:${PORT}`, trace: "off", locale: "ja-JP", timezoneId: "Asia/Tokyo" },
  // 既定は Chromium のみ。PW_BROWSERS=firefox,webkit のように指定すると、そのブラウザでも実行する (CI のクロスブラウザ試験)
  projects: (process.env.PW_BROWSERS ?? "chromium").split(",").map((name) => ({
    name,
    use: { ...devices[{ chromium: "Desktop Chrome", firefox: "Desktop Firefox", webkit: "Desktop Safari" }[name] ?? "Desktop Chrome"] },
  })),
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/login`,
    reuseExistingServer: false,
    env: { DATABASE_URL: TEST_DATABASE_URL, APP_ENV: "test" }, // 本番ビルドで試験するが、HTTPS ではないため test を明示
    timeout: 120_000,
  },
});
