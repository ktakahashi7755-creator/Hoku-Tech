import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { login, logout } from "./helpers";

// 1 つのテストで多くの画面を検査するため、制限時間を延ばす
test.describe.configure({ timeout: 180_000 });

/** WCAG 2.2 A / AA の自動検査 (axe-core)。自動検査で見つかるのは問題の一部のため、手動確認も別途行う */
async function audit(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  const summary = result.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.help}\n    ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join("\n    ")}`,
  );
  expect(summary, `${path} のアクセシビリティ違反`).toEqual([]);
}

test("ログイン画面", async ({ page }) => {
  await audit(page, "/login");
});

test("受講生の画面", async ({ page }) => {
  await login(page, "student@its.example");
  await page.waitForURL(/\/home$/);
  // スマホ幅 (横スクロールする領域が増える) と PC 幅の両方で検査する
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/home", "/curriculum", "/lessons/l2-methods", "/lessons/l4-javascript", "/assignments", "/assignments/a2-grade-calculator", "/progress", "/reviews", "/me"]) {
      await audit(page, path);
    }
  }
  await logout(page);
});

test("講師・管理者の画面", async ({ page }) => {
  await login(page, "admin@its.example");
  await page.waitForURL(/\/admin$/);
  await page.goto("/admin/students");
  const studentUrl = await page.getByRole("link", { name: "佐藤 健" }).getAttribute("href");
  await page.goto("/admin/content");
  const lessonUrl = await page.getByRole("link", { name: "変数とデータ型" }).getAttribute("href");
  for (const path of ["/admin", "/admin/students", studentUrl!, "/admin/reviews?view=done", "/admin/settings", "/admin/content", lessonUrl!, "/admin/students/new", "/admin/users", "/admin/content/assignments"]) {
    await audit(page, path);
  }
  await logout(page);
});

test("キーボードだけでログインでき、本文へスキップできる", async ({ page }) => {
  await page.goto("/login");
  await page.keyboard.press("Tab"); // 本文へスキップ
  await expect(page.getByRole("link", { name: "本文へスキップ" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("メールアドレス")).toBeFocused();
  await page.keyboard.type("student@its.example");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("パスワード")).toBeFocused();
  await page.keyboard.type(process.env.SEED_PASSWORD ?? "its-dev-password-2026");
  await page.keyboard.press("Enter");
  await page.waitForURL(/\/home$/);

  // ページを開いた直後: 最初の Tab でスキップリンク、Enter で本文 (main) へ移動できる
  // (ログイン直後はクライアント側の画面遷移のためフォーカス位置が先頭に戻らない。手動確認の項目として test-plan.md に記載)
  await page.goto("/home");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "本文へスキップ" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  await logout(page);
});
