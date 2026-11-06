import { expect, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { TEST_DATABASE_URL } from "../../playwright.config";
import { login, logout } from "./helpers";

test.describe.configure({ mode: "serial" });

test("管理者: 公開中のレッスンを編集 → 下書きは受講生に見えない → プレビュー → 公開で切り替わる", async ({ page }) => {
  await login(page, "admin@its.example");
  await page.waitForURL(/\/admin$/);
  await page.goto("/admin/content");
  await page.getByRole("link", { name: "条件分岐 (if / switch)" }).click();
  await expect(page.getByRole("heading", { name: "条件分岐 (if / switch)", level: 1 })).toBeVisible();

  await page.locator("#title").fill("条件分岐 (if / switch 式)");
  await page.getByLabel("目標").fill("if / else if / else で条件に応じた処理を書ける\nswitch 式で多分岐を書ける");
  await page.getByLabel("変更内容のメモ (版の履歴に残ります)").fill("switch 式の目標を追加");
  await page.getByRole("button", { name: "下書きを保存" }).click();
  await expect(page.getByRole("status").filter({ hasText: "下書き (版 2) を保存しました" })).toBeVisible();

  // 受講生にはまだ旧版が表示される
  await logout(page);
  await login(page, "student@its.example");
  await page.waitForURL(/\/home$/);
  await page.goto("/lessons/l2-conditionals");
  await expect(page.getByRole("heading", { name: "条件分岐 (if / switch)", level: 1 })).toBeVisible();
  await logout(page);

  // プレビューで確認してから公開
  await login(page, "admin@its.example");
  await page.waitForURL(/\/admin$/);
  await page.goto("/admin/content");
  await page.getByRole("link", { name: "条件分岐 (if / switch)" }).click();
  await page.getByRole("link", { name: "プレビュー" }).first().click();
  await expect(page.getByRole("heading", { name: "条件分岐 (if / switch 式)" })).toBeVisible();
  await expect(page.getByText("switch 式で多分岐を書ける")).toBeVisible();
  await page.getByRole("link", { name: "編集へ戻る" }).click();
  await page.getByRole("button", { name: "今すぐ公開する" }).click();
  await expect(page.getByText("公開待ちの下書きはありません")).toBeVisible();
  await expect(page.getByText("switch 式の目標を追加")).toBeVisible(); // 版の履歴

  // コードを変えていないので「自動実行検証済み」の表示が引き継がれる
  await logout(page);
  await login(page, "student@its.example");
  await page.waitForURL(/\/home$/);
  await page.goto("/lessons/l2-conditionals");
  await expect(page.getByRole("heading", { name: "条件分岐 (if / switch 式)", level: 1 })).toBeVisible();
  await expect(page.getByText("版 2")).toBeVisible();
  await expect(page.getByText("下の実行結果と一致することを自動で確認しています")).toBeVisible();
  await logout(page);
});

test("管理者: 新規レッスンは必須項目が揃うまで公開できず、受講生にも表示されない", async ({ page }) => {
  await login(page, "admin@its.example");
  await page.waitForURL(/\/admin$/);
  await page.goto("/admin/content");
  const form = page.locator("details", { hasText: "L3 にレッスンを追加" });
  await form.getByText("L3 にレッスンを追加").click();
  await form.getByLabel("タイトル").fill("文字列の操作");
  await form.getByLabel("URL 名 (例: l2-strings)").fill("l3-strings");
  await form.getByRole("button", { name: "作成" }).click();
  await page.waitForURL(/\/admin\/content\/lessons\/c/);

  await page.getByRole("button", { name: "下書きを保存" }).click();
  await expect(page.getByText("公開するには次の項目が必要です")).toBeVisible();
  await page.getByRole("button", { name: "今すぐ公開する" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "公開に必要な項目が不足しています" })).toBeVisible();

  const res = await page.request.get("/lessons/l3-strings");
  expect(await res.text()).not.toContain("文字列の操作</h1>");
  await logout(page);

  await login(page, "student@its.example");
  await page.waitForURL(/\/home$/);
  await page.goto("/curriculum");
  await expect(page.getByText("文字列の操作")).toHaveCount(0);
  await logout(page);
});

test("管理者: 公開予約した版は予約時刻を過ぎると公開される", async ({ page }) => {
  await login(page, "admin@its.example");
  await page.waitForURL(/\/admin$/);
  await page.goto("/admin/content");
  await page.getByRole("link", { name: "メソッド (処理に名前を付ける)" }).click();
  await page.locator("#title").fill("メソッド (処理に名前を付けて再利用する)");
  await page.getByRole("button", { name: "下書きを保存" }).click();
  await expect(page.getByRole("status").filter({ hasText: "下書き (版 2) を保存しました" })).toBeVisible();
  await page.getByLabel("公開を予約する (日本時間)").fill("2099-01-01T09:00");
  await page.getByRole("button", { name: "予約する" }).click();
  await expect(page.getByText(/2099\/01\/01 09:00 に公開する予約があります/)).toBeVisible();
  await logout(page);

  // 予約時刻が過ぎた状態を作る (テスト用 DB を直接更新)
  const db = new PrismaClient({ datasourceUrl: TEST_DATABASE_URL });
  await db.lesson.update({ where: { slug: "l2-methods" }, data: { publishAt: new Date(Date.now() - 1000) } });
  await db.$disconnect();

  await login(page, "student@its.example");
  await page.waitForURL(/\/home$/);
  await page.goto("/lessons/l2-methods");
  await expect(page.getByRole("heading", { name: "メソッド (処理に名前を付けて再利用する)", level: 1 })).toBeVisible();
  await logout(page);
});

test("講師は教材管理を開けない", async ({ page }) => {
  await login(page, "instructor@its.example");
  await page.waitForURL(/\/admin$/);
  const res = await page.goto("/admin/content");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "ページが見つかりません" })).toBeVisible();
  await expect(page.getByRole("link", { name: "教材管理" })).toHaveCount(0);
});
