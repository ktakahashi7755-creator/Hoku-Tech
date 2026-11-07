import { createPrismaClient } from "../../src/lib/prisma-client";
import { TEST_DATABASE_URL } from "../../playwright.config";
import { expect, test, type Page } from "./fixtures";
import { login } from "./helpers";

/**
 * 教材管理 (レッスン・課題・ルーブリックの編集) の使い勝手の確認。
 * テストに必要な状態はテスト用 DB を直接変更して作り、終わったら元に戻す。
 */
test.describe.configure({ mode: "serial" });

const db = createPrismaClient(TEST_DATABASE_URL);
test.afterAll(async () => db.$disconnect());

const SLUG = "l3-inheritance"; // ほかのテストが使わないレッスン

/** レッスンの状態を覚えておき、テストで増えた版を消して元に戻す */
async function snapshotLesson() {
  const lesson = await db.lesson.findUniqueOrThrow({ where: { slug: SLUG }, include: { currentVersion: true } });
  const before = await db.lessonVersion.findMany({ where: { lessonId: lesson.id }, select: { id: true } });
  const original = { currentVersionId: lesson.currentVersionId, scheduledVersionId: lesson.scheduledVersionId, publishAt: lesson.publishAt, status: lesson.status };
  return {
    lesson,
    restore: async () => {
      await db.lesson.update({ where: { id: lesson.id }, data: original });
      await db.lessonVersion.deleteMany({ where: { lessonId: lesson.id, id: { notIn: before.map((v) => v.id) } } });
    },
  };
}

/** 確認ダイアログの文言を集める (OK を押すのは fixtures.ts) */
function collectDialogs(page: Page) {
  const messages: string[] = [];
  page.on("dialog", (d) => void messages.push(`${d.type()}: ${d.message()}`));
  return messages;
}

async function openAsAdmin(page: Page, path: string) {
  await login(page, "admin@its.example");
  await page.waitForURL(/\/admin$/);
  await page.goto(path);
}

test("保存済みの下書きがあるとき、版から下書きを作る前に上書きを確認し、公開後はメモを引き継がない", async ({ page }) => {
  const { lesson, restore } = await snapshotLesson();
  const originalTitle = lesson.currentVersion!.title;
  try {
    const dialogs = collectDialogs(page);
    await openAsAdmin(page, `/admin/content/lessons/${lesson.id}`);
    await page.locator("#title").fill(`${originalTitle} (下書き)`);
    await page.getByLabel("変更内容のメモ (版の履歴に残ります)").fill("下書きのメモ");
    await page.getByRole("button", { name: "下書きを保存" }).click();
    await expect(page.getByRole("status").filter({ hasText: "を保存しました" })).toBeVisible();
    const draft = await db.lessonVersion.findFirstOrThrow({ where: { lessonId: lesson.id }, orderBy: { version: "desc" } });
    const count = await db.lessonVersion.count({ where: { lessonId: lesson.id } });

    await page.getByRole("button", { name: "この版から下書きを作る" }).first().click();
    // 再読み込みの後に結果が表示され、URL には結果の印が残らない
    await expect(page.getByRole("status").filter({ hasText: `の内容で下書き (版 ${draft.version}) を作りました` })).toBeVisible();
    expect(dialogs.some((m) => m.includes(`下書き (版 ${draft.version}) があります`))).toBe(true);
    expect(page.url()).not.toContain("cmsNotice");
    await expect(page.locator("#title")).toHaveValue(originalTitle);
    // 下書きは上書きされ、版は増えない
    expect(await db.lessonVersion.count({ where: { lessonId: lesson.id } })).toBe(count);

    // 公開すると、その版のメモは次の版のメモとして残らない
    await page.getByRole("button", { name: "今すぐ公開する" }).click();
    await expect(page.getByRole("status").filter({ hasText: `版 ${draft.version} を公開しました` })).toBeVisible();
    await expect(page.getByLabel("変更内容のメモ (版の履歴に残ります)")).toHaveValue("");
    await page.reload();
    await expect(page.getByLabel("変更内容のメモ (版の履歴に残ります)")).toHaveValue("");
  } finally {
    await restore();
  }
});

test("過去の日時で予約しようとすると、確認を出す前にその場で知らせる", async ({ page }) => {
  const { lesson, restore } = await snapshotLesson();
  try {
    const dialogs = collectDialogs(page);
    await openAsAdmin(page, `/admin/content/lessons/${lesson.id}`);
    await page.locator("#title").fill(`${lesson.currentVersion!.title} (予約)`);
    await page.getByRole("button", { name: "下書きを保存" }).click();
    await expect(page.getByRole("status").filter({ hasText: "を保存しました" })).toBeVisible();

    await page.getByLabel("公開を予約する (日本時間)").fill("2020-01-01T09:00");
    await page.getByRole("button", { name: "予約する" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "公開日時は現在より後にしてください" })).toBeVisible();
    expect(dialogs.filter((m) => m.includes("予約します"))).toHaveLength(0);
    expect((await db.lesson.findUniqueOrThrow({ where: { id: lesson.id } })).scheduledVersionId).toBeNull();
  } finally {
    await restore();
  }
});

test("古い版に戻して公開すると、編集フォームがその版の内容に切り替わり、公開日時は初回公開と分かる", async ({ page }) => {
  const { lesson, restore } = await snapshotLesson();
  const v1 = lesson.currentVersion!;
  try {
    // 公開中の版の後に、もう 1 つ公開した版を作る
    const v2 = await db.lessonVersion.create({
      data: { lessonId: lesson.id, version: (await db.lessonVersion.findFirstOrThrow({ where: { lessonId: lesson.id }, orderBy: { version: "desc" } })).version + 1, title: `${v1.title} (新しい版)`, estimatedMinutes: v1.estimatedMinutes, content: v1.content ?? {}, changeNote: "テスト用の版", publishedAt: new Date() },
    });
    await db.lesson.update({ where: { id: lesson.id }, data: { currentVersionId: v2.id } });

    await openAsAdmin(page, `/admin/content/lessons/${lesson.id}`);
    await expect(page.locator("#title")).toHaveValue(v2.title);
    await expect(page.getByText(/初回公開/).first()).toBeVisible();
    await expect(page.getByRole("link", { name: `公開中の版 (版 ${v2.version}) との差分` }).first()).toBeVisible();

    await page.getByRole("button", { name: "この版に戻して公開" }).first().click();
    await expect(page.getByRole("status").filter({ hasText: `版 ${v1.version} を公開しました` })).toBeVisible();
    await expect(page.locator("#title")).toHaveValue(v1.title);
    expect((await db.lesson.findUniqueOrThrow({ where: { id: lesson.id } })).currentVersionId).toBe(v1.id);
  } finally {
    await restore();
  }
});

test("広い画面 (768px) で Tab で移った入力欄が、画面下に固定した保存欄に隠れない", async ({ page }) => {
  const { lesson } = await snapshotLesson();
  await page.setViewportSize({ width: 768, height: 768 });
  await openAsAdmin(page, `/admin/content/lessons/${lesson.id}`);
  await page.locator("#title").focus();
  // 保存欄 (変更内容のメモを含む固定の欄) の上端より下に、フォーカスした欄の下端がはみ出していないか
  const hidden = () =>
    page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      const bar = document.getElementById("changeNote")?.closest<HTMLElement>("div[class*='sm:sticky']");
      if (!el || !bar || bar.contains(el) || !el.closest("form")) return false;
      return el.getBoundingClientRect().bottom > bar.getBoundingClientRect().top + 1;
    });
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    await expect.poll(hidden, { timeout: 2000 }).toBe(false);
  }
});

test("ルーブリック: 配点を直した後は古いエラーを出さず、保存していない変更は離れる前に確認する", async ({ page }) => {
  const rubric = await db.rubric.findFirstOrThrow({ orderBy: { createdAt: "asc" } });
  const dialogs = collectDialogs(page);
  await openAsAdmin(page, `/admin/content/rubrics/${rubric.id}`);
  const weight = page.getByLabel("配点", { exact: true }).first();
  const original = await weight.inputValue();
  await weight.fill(String(Number(original) + 30));
  await page.getByRole("button", { name: "保存", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "配点の合計を 100 にしてください" })).toBeVisible();
  await weight.fill(original);
  await expect(page.getByText("配点の合計を 100 にしてください")).toHaveCount(0);
  await expect(page.getByText("配点の合計: 100 / 100 点")).toBeVisible();

  await page.reload();
  expect(dialogs.some((m) => m.startsWith("beforeunload"))).toBe(true);
});

test("課題: 保存していない変更があるまま再読み込みすると確認を出し、保存した後は出さない", async ({ page }) => {
  const assignment = await db.assignment.findFirstOrThrow({ where: { slug: "a1-github-profile" } });
  const dialogs = collectDialogs(page);
  await openAsAdmin(page, `/admin/content/assignments/${assignment.id}`);
  await page.getByLabel("課題の目的").fill(`${await page.getByLabel("課題の目的").inputValue()} `);
  await page.reload();
  expect(dialogs.filter((m) => m.startsWith("beforeunload"))).toHaveLength(1);
  // 変更しないまま再読み込みしても確認は出ない
  await page.reload();
  expect(dialogs.filter((m) => m.startsWith("beforeunload"))).toHaveLength(1);
});

test("教材管理の一覧: 公開・非公開のボタンは、読み上げでどのレッスンのものかが分かる", async ({ page }) => {
  const { lesson } = await snapshotLesson();
  await openAsAdmin(page, "/admin/content");
  await expect(page.getByRole("button", { name: `「${lesson.currentVersion!.title}」を非公開にする` })).toBeVisible();
});
