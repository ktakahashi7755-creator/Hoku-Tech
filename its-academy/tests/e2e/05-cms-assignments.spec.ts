import { expect, test } from "@playwright/test";
import { login, logout } from "./helpers";

test.describe.configure({ mode: "serial" });

test("課題の合格点を変えても、過去の採点は採点時の合格点のまま残る", async ({ page }) => {
  await login(page, "admin@its.example");
  await page.waitForURL(/\/admin$/);
  await page.goto("/admin/content/assignments");
  await page.getByRole("link", { name: "GitHub に自己紹介リポジトリを公開する" }).click();
  await page.getByLabel("合格点 (100 点満点)").fill("75");
  await page.getByRole("button", { name: "保存" }).click();
  await expect(page.getByRole("status").filter({ hasText: "課題を保存しました" })).toBeVisible();
  await logout(page);

  await login(page, "student@its.example");
  await page.waitForURL(/\/home$/);
  await page.goto("/assignments/a1-github-profile");
  await expect(page.getByText("合格点 75 / 100")).toBeVisible();
  await expect(page.getByText(/\(合格点 70\)/).first()).toBeVisible(); // seed で採点済みのレビューは当時の合格点
  await logout(page);
});

test("ルーブリックの配点の合計は 100 でなければ保存できない", async ({ page }) => {
  await login(page, "admin@its.example");
  await page.waitForURL(/\/admin$/);
  await page.goto("/admin/content/assignments");
  await page.getByRole("link", { name: "標準ルーブリック (コード課題)" }).click();
  await page.getByLabel("配点").first().fill("30"); // 要件充足 25 → 30 (合計 105)
  await expect(page.getByText("配点の合計: 105 / 100")).toBeVisible();
  await page.getByRole("button", { name: "保存" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "配点の合計を 100 にしてください (現在 105)" })).toBeVisible();
  await page.getByLabel("配点").nth(1).fill("15"); // 正確性 20 → 15 (合計 100)
  await page.getByRole("button", { name: "保存" }).click();
  await expect(page.getByRole("status").filter({ hasText: "ルーブリックを保存しました" })).toBeVisible();
  await logout(page);
});

test("新しい課題は下書きで作られ、公開するまで受講生に見えない", async ({ page }) => {
  await login(page, "admin@its.example");
  await page.waitForURL(/\/admin$/);
  await page.goto("/admin/content/assignments");
  const form = page.locator("details", { hasText: "L2 に課題を追加" });
  await form.getByText("L2 に課題を追加").click();
  await form.getByLabel("タイトル").fill("FizzBuzz を書く");
  await form.getByLabel(/URL 名/).fill("a9-fizzbuzz");
  await form.getByRole("button", { name: "作成" }).click();
  await page.waitForURL(/\/admin\/content\/assignments\/c/);
  await logout(page);

  await login(page, "student@its.example");
  await page.waitForURL(/\/home$/);
  await page.goto("/assignments");
  await expect(page.getByText("FizzBuzz を書く")).toHaveCount(0);
  await logout(page);
});

test("レッスンの版の差分を表示できる", async ({ page }) => {
  await login(page, "admin@its.example");
  await page.waitForURL(/\/admin$/);
  await page.goto("/admin/content");
  await page.getByRole("link", { name: "条件分岐 (if / switch 式)" }).click(); // 02-cms で版 2 を公開済み
  await page.getByRole("link", { name: "前の版との差分" }).first().click();
  await expect(page.getByRole("heading", { name: "差分: 版 1 → 版 2" })).toBeVisible();
  await expect(page.getByText("タイトル: 条件分岐 (if / switch 式)")).toBeVisible();
  await expect(page.getByText("switch 式で多分岐を書ける").first()).toBeVisible();
});
