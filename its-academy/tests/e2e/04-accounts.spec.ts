import { expect, test } from "@playwright/test";
import { login, logout } from "./helpers";

test.describe.configure({ mode: "serial" });

const row = (page: import("@playwright/test").Page, email: string) => page.getByRole("row").filter({ hasText: email });

test("仮パスワード: 発行 → 本人がログイン → 変更を求められ、変更すると解除される", async ({ page }) => {
  await login(page, "admin@its.example");
  await page.waitForURL(/\/admin$/);
  await page.goto("/admin/users");
  await row(page, "student3@its.example").getByRole("button", { name: "仮パスワードを発行" }).click();
  const shown = row(page, "student3@its.example").getByText(/仮パスワード \(この画面を離れると再表示できません\)/);
  await expect(shown).toBeVisible();
  const temp = (await shown.locator("span.font-mono").textContent())!.trim();
  expect(temp.length).toBeGreaterThanOrEqual(16);
  await logout(page);

  await login(page, "student3@its.example", temp);
  await page.waitForURL(/\/me\?changePassword=1$/);
  await expect(page.getByRole("alert").filter({ hasText: "仮パスワードでログインしています" })).toBeVisible();
  await page.getByLabel("現在のパスワード").fill(temp);
  await page.getByLabel("新しいパスワード", { exact: true }).fill("misaki-new-password-2026");
  await page.getByLabel("新しいパスワード (確認)").fill("misaki-new-password-2026");
  await page.getByRole("button", { name: "変更する" }).click();
  await expect(page.getByText("パスワードを変更しました。")).toBeVisible();
  await page.goto("/home");
  await expect(page.getByRole("alert").filter({ hasText: "仮パスワードでログインしています" })).toHaveCount(0);
  await logout(page);

  // 元のパスワードではログインできない
  await login(page, "student3@its.example");
  await expect(page.getByRole("alert").filter({ hasText: "正しくありません" })).toBeVisible();
});

test("利用停止したアカウントはログインできず、再開すると戻る", async ({ page }) => {
  await login(page, "admin@its.example");
  await page.waitForURL(/\/admin$/);
  await page.goto("/admin/users");
  await row(page, "student4@its.example").getByRole("button", { name: "利用を停止" }).click();
  await expect(row(page, "student4@its.example").getByText("停止中")).toBeVisible();
  await logout(page);

  await login(page, "student4@its.example");
  await expect(page.getByRole("alert").filter({ hasText: "正しくありません" })).toBeVisible();

  await login(page, "admin@its.example");
  await page.waitForURL(/\/admin$/);
  await page.goto("/admin/users");
  await row(page, "student4@its.example").getByRole("button", { name: "利用を再開" }).click();
  await expect(row(page, "student4@its.example").getByText("利用中")).toBeVisible();
  await logout(page);
  await login(page, "student4@its.example");
  await page.waitForURL(/\/home$/);
  await logout(page);
});

test("権限の変更と、操作できる範囲の制限", async ({ page }) => {
  await login(page, "admin@its.example");
  await page.waitForURL(/\/admin$/);
  await page.goto("/admin/users");
  // ADMIN は自分自身と SUPER_ADMIN を操作できない。付与できる権限は講師・受講生のみ
  await expect(row(page, "admin@its.example").getByText("操作できません")).toBeVisible();
  await expect(row(page, "super@its.example").getByText("操作できません")).toBeVisible();
  const select = row(page, "instructor2@its.example").getByRole("combobox");
  await expect(select.locator("option")).toHaveText(["講師", "受講生"]);

  // 講師 → 受講生 → 講師 に戻す (権限変更は監査ログに残る)
  await select.selectOption("STUDENT");
  await row(page, "instructor2@its.example").getByRole("button", { name: "変更" }).click();
  await expect(row(page, "instructor2@its.example").getByRole("cell", { name: "受講生", exact: true })).toBeVisible();
  await row(page, "instructor2@its.example").getByRole("combobox").selectOption("INSTRUCTOR");
  await row(page, "instructor2@its.example").getByRole("button", { name: "変更" }).click();
  await expect(row(page, "instructor2@its.example").getByRole("cell", { name: "講師", exact: true })).toBeVisible();
  await page.goto("/admin/settings");
  await expect(page.getByText("user.role_change").first()).toBeVisible();
  await logout(page);

  // 講師はアカウント管理を開けない (本当の 404)
  await login(page, "instructor@its.example");
  await page.waitForURL(/\/admin$/);
  const res = await page.goto("/admin/users");
  expect(res?.status()).toBe(404);
});
