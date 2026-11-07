import { createPrismaClient } from "../../src/lib/prisma-client";
import { TEST_DATABASE_URL } from "../../playwright.config";
import { expect, test } from "./fixtures";
import { login, logout } from "./helpers";

test.describe.configure({ mode: "serial" });

test("同じメールアドレスで 5 回失敗すると、その後は正しいパスワードでもログインできない", async ({ page }) => {
  // 他のテストに影響しないよう、この試験専用の受講生を管理者が追加する
  const email = `throttle-${Date.now()}@its.example`;
  await login(page, "admin@its.example");
  await page.waitForURL(/\/admin$/);
  await page.goto("/admin/students/new");
  await page.getByLabel("氏名").fill("試行 制限");
  await page.getByLabel("メールアドレス").fill(email);
  await page.getByRole("button", { name: "追加する" }).click();
  const credentials = page.getByText(`${email} / `);
  await expect(credentials).toBeVisible();
  const temp = (await credentials.textContent())!.split(" / ")[1].trim();
  await logout(page);

  for (let i = 0; i < 5; i++) {
    await login(page, email, `wrong-password-${i}-xxxx`);
    await expect(page.getByRole("alert").filter({ hasText: "正しくありません" })).toBeVisible();
  }
  await login(page, email, temp);
  await expect(page.getByRole("alert").filter({ hasText: "試行回数が上限に達しました" })).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test("同時にまとめて送っても、上限を超えてパスワードを照合しない", async ({ browser }) => {
  const email = `burst-${Date.now()}@its.example`;
  const context = await browser.newContext();
  const pages = await Promise.all(Array.from({ length: 10 }, () => context.newPage()));
  await Promise.all(
    pages.map(async (p, i) => {
      await p.goto("/login");
      await p.getByLabel("メールアドレス").fill(email);
      await p.getByLabel("パスワード").fill(`wrong-password-${i}-xxxx`);
    }),
  );
  await Promise.all(pages.map((p) => p.getByRole("button", { name: "ログイン" }).click()));
  await Promise.all(pages.map((p) => expect(p.getByRole("alert").filter({ hasText: /正しくありません|上限に達しました/ })).toBeVisible()));
  // 照合まで進んだ試行 (= 失敗として残る記録) は、上限の 5 回まで
  const db = createPrismaClient(TEST_DATABASE_URL);
  try {
    expect(await db.loginAttempt.count({ where: { email, success: false } })).toBeLessThanOrEqual(5);
  } finally {
    await db.$disconnect();
    await context.close();
  }
});

test("講師・管理者の画面も 375px で横スクロールしない", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await login(page, "admin@its.example");
  await page.waitForURL(/\/admin$/);
  await page.goto("/admin/students");
  const studentUrl = await page.getByRole("link", { name: "山田 花子" }).first().getAttribute("href");
  await page.goto("/admin/content");
  const lessonUrl = await page.getByRole("link", { name: "変数とデータ型" }).getAttribute("href");
  const paths = ["/admin", "/admin/students", studentUrl!, "/admin/reviews", "/admin/reviews?view=done", "/admin/content", lessonUrl!,
    "/admin/content/assignments", "/admin/students/new", "/admin/users", "/admin/settings"];
  for (const path of paths) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${path} @ 375px`).toBeLessThanOrEqual(0);
  }
});

test("死活監視はログインなしで応答し、内部情報を返さない。セキュリティヘッダーが付く", async ({ request }) => {
  const health = await request.get("/api/health");
  expect(health.status()).toBe(200);
  expect(await health.json()).toEqual({ status: "ok" });
  expect(health.headers()["cache-control"]).toContain("no-store");

  const res = await request.get("/login");
  const h = res.headers();
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["referrer-policy"]).toBeTruthy();
  expect(h["x-powered-by"]).toBeUndefined();
});

test("レッスン・課題のページ名に、そのレッスン名・課題名が入る (タブ・読み上げで区別できる)", async ({ page }) => {
  await login(page, "student@its.example");
  await page.waitForURL(/\/home$/);
  await page.goto("/lessons/l2-loops-arrays"); // CMS の E2E で編集しないレッスン
  await expect(page).toHaveTitle(/^繰り返しと配列 \| ITS ENGINEER ACADEMY$/);
  await page.goto("/assignments/a2-grade-calculator");
  await expect(page).toHaveTitle(/^成績判定プログラム \| ITS ENGINEER ACADEMY$/);
  await logout(page);
});
