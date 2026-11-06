import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
export const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ?? "postgresql://its:its_dev_only@localhost:5432/its_academy_test";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1, // DB を共有するシナリオ試験のため直列に実行
  retries: 0,
  reporter: [["list"]],
  globalSetup: "./tests/e2e/global-setup.ts",
  use: { baseURL: `http://localhost:${PORT}`, trace: "off", locale: "ja-JP", timezoneId: "Asia/Tokyo" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/login`,
    reuseExistingServer: false,
    env: { DATABASE_URL: TEST_DATABASE_URL },
    timeout: 120_000,
  },
});
