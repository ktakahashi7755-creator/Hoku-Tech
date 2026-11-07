import { createPrismaClient } from "../../src/lib/prisma-client";
import { TEST_DATABASE_URL } from "../../playwright.config";
import { expect, test } from "./fixtures";
import { login, logout } from "./helpers";

/**
 * 受講生・講師の画面の見え方の確認 (未読の印・過去の提出内容・下書きの表示・用語の統一・狭い画面のメニュー)。
 * テストに必要な状態はテスト用 DB を直接変更して作り、終わったら元に戻す。
 */
test.describe.configure({ mode: "serial" });

const db = createPrismaClient(TEST_DATABASE_URL);
test.afterAll(async () => db.$disconnect());

const userId = async (email: string) => (await db.user.findUniqueOrThrow({ where: { email } })).id;
const mainMenu = (page: import("@playwright/test").Page) => page.getByRole("navigation", { name: "メインメニュー" });

test("受講生: 未読のお知らせがあるとメニューとホームに件数が出て、お知らせを開くと消える", async ({ page }) => {
  const hanako = await userId("student@its.example");
  // 表示すると既読になるため、もともと未読だったものを覚えておき、最後に未読へ戻す
  const unreadBefore = (await db.notification.findMany({ where: { userId: hanako, readAt: null }, select: { id: true } })).map((n) => n.id);
  const notice = await db.notification.create({ data: { userId: hanako, title: "E2E レビュー結果のお知らせ", body: "E2E の確認用です。", link: "/reviews" } });
  try {
    await login(page, "student@its.example");
    await page.waitForURL(/\/home$/);
    const count = unreadBefore.length + 1;
    await expect(mainMenu(page).getByRole("link", { name: new RegExp(`^質問・レビュー\\s*\\(新着 ${count} 件\\)$`) })).toBeVisible();
    await expect(page.getByText(`まだ見ていないお知らせ (レビュー結果・講師コメント) が ${count} 件あります。`)).toBeVisible();

    await page.getByRole("link", { name: "質問・レビューで確認する" }).click();
    await page.waitForURL(/\/reviews$/);
    await expect(page.getByText("E2E レビュー結果のお知らせ")).toBeVisible();
    // お知らせを表示した画面では、メニューの件数を消す (画面を移動しても戻らない)
    await expect(mainMenu(page).getByRole("link", { name: "質問・レビュー", exact: true })).toBeVisible();
    await mainMenu(page).getByRole("link", { name: "ホーム" }).click();
    await page.waitForURL(/\/home$/);
    await expect(mainMenu(page).getByRole("link", { name: /新着/ })).toHaveCount(0);
  } finally {
    await db.notification.delete({ where: { id: notice.id } });
    if (unreadBefore.length) await db.notification.updateMany({ where: { id: { in: unreadBefore } }, data: { readAt: null } });
  }
});

test("過去の提出内容: 受講生は課題の画面で、講師は採点の画面で、前の回の内容を開いて確認できる", async ({ page }) => {
  const ken = await userId("student2@its.example");
  const assignment = await db.assignment.findUniqueOrThrow({ where: { slug: "a1-github-profile" } });
  const last = await db.submission.findFirst({ where: { assignmentId: assignment.id, userId: ken }, orderBy: { attemptNo: "desc" } });
  const no = (last?.attemptNo ?? 0) + 1;
  const old = await db.submission.create({
    data: { assignmentId: assignment.id, userId: ken, attemptNo: no, status: "CHANGES_REQUESTED", repoUrl: "https://github.com/example/e2e-views-old", note: "E2E 前回の備考です", submittedAt: new Date(Date.now() - 60_000) },
  });
  const current = await db.submission.create({
    data: { assignmentId: assignment.id, userId: ken, attemptNo: no + 1, status: "RESUBMITTED", repoUrl: "https://github.com/example/e2e-views-new", submittedAt: new Date() },
  });
  try {
    await login(page, "student2@its.example");
    await page.waitForURL(/\/home$/);
    await page.goto("/assignments/a1-github-profile");
    await expect(page.getByText("E2E 前回の備考です")).toBeHidden(); // 最初は折りたたんでおく
    await page.getByText(`${no} 回目の提出内容を見る`, { exact: true }).click();
    await expect(page.getByText("E2E 前回の備考です")).toBeVisible();
    await expect(page.getByRole("link", { name: "https://github.com/example/e2e-views-old" })).toBeVisible();
    await logout(page);

    await login(page, "instructor@its.example");
    await page.waitForURL(/\/admin$/);
    await page.goto(`/admin/reviews/${current.id}`);
    await expect(page.getByText("この画面で表示している提出です。")).toBeVisible();
    await page.getByText(`${no} 回目の提出内容を見る`, { exact: true }).click();
    await expect(page.getByText("E2E 前回の備考です")).toBeVisible();
  } finally {
    await db.submission.deleteMany({ where: { id: { in: [old.id, current.id] } } });
  }
});

test("受講生: 下書きがあれば、再読み込みしても「下書きを保存済み」と表示する", async ({ page }) => {
  const ken = await userId("student2@its.example");
  const assignment = await db.assignment.findUniqueOrThrow({ where: { slug: "a2-grade-calculator" } });
  const last = await db.submission.findFirst({ where: { assignmentId: assignment.id, userId: ken }, orderBy: { attemptNo: "desc" } });
  test.skip(!last || last.status === "DRAFT", "seed の修正依頼の提出が前提");
  const draft = await db.submission.create({
    data: { assignmentId: assignment.id, userId: ken, attemptNo: last!.attemptNo + 1, status: "DRAFT", text: "// E2E の下書き", note: "" },
  });
  try {
    await login(page, "student2@its.example");
    await page.waitForURL(/\/home$/);
    await page.goto("/assignments/a2-grade-calculator");
    await expect(page.getByText(/下書きを保存済み \(\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}\)/)).toBeVisible();
    await expect(page.getByLabel("提出するコード・回答")).toHaveValue("// E2E の下書き");
  } finally {
    await db.submission.delete({ where: { id: draft.id } });
  }
});

test("受講生: 用語と件数の表示がそろっている (前提レッスン未完了・必修の件数・版の番号は出さない)", async ({ page }) => {
  await login(page, "student4@its.example");
  await page.waitForURL(/\/home$/);
  await expect(page.getByText(/^必修 \d+ \/ \d+$/).first()).toBeVisible();

  // 一覧で「前提レッスン未完了」の課題は、詳細の画面でも同じ表示にする
  await page.goto("/assignments");
  const lockedRow = page.getByRole("row").filter({ hasText: "前提レッスン未完了" }).first();
  await expect(lockedRow).toBeVisible();
  const title = (await lockedRow.getByRole("link").first().textContent())!.trim();
  await lockedRow.getByRole("link").first().click();
  await expect(page.getByRole("heading", { name: title, level: 1 })).toBeVisible();
  await expect(page.locator("header").getByText("前提レッスン未完了")).toBeVisible();
  await expect(page.locator("header").getByText("未着手", { exact: true })).toHaveCount(0);

  // レッスンの位置は必修・選択を分けて数え、版の番号は受講生に見せない
  await page.goto("/lessons/l0-how-to-learn");
  await expect(page.getByText(/必修レッスン 1 \/ \d+/)).toBeVisible();
  await expect(page.getByText(/^版 \d+$/)).toHaveCount(0);
});

test("スマホ幅: 今いる画面のメニューが横にはみ出さず見える位置にある", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await login(page, "student@its.example");
  await page.waitForURL(/\/home$/);
  await page.goto("/me");
  const active = mainMenu(page).getByRole("link", { name: "マイページ" });
  await expect(active).toHaveAttribute("aria-current", "page");
  await expect(active).toBeInViewport({ ratio: 1 });
  expect(await page.evaluate(() => window.scrollY)).toBe(0); // 縦には動かさない
});

test("アカウント管理: 行ごとの操作ボタンは、読み上げで誰に対する操作か分かる", async ({ page }) => {
  await login(page, "admin@its.example");
  await page.waitForURL(/\/admin$/);
  await page.goto("/admin/users");
  await expect(page.getByRole("button", { name: "高橋 陽太 さんの仮パスワードを発行" })).toBeVisible();
  await expect(page.getByRole("button", { name: /^高橋 陽太 さんの利用を(停止|再開)$/ })).toBeVisible();
});
