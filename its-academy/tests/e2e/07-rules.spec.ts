import { createPrismaClient } from "../../src/lib/prisma-client";
import { TEST_DATABASE_URL } from "../../playwright.config";
import { expect, test } from "./fixtures";
import { login } from "./helpers";

/**
 * サーバー側のルールの確認 (画面の表示だけでなく、URL を直接開いた場合も含む)。
 * テストに必要な状態はテスト用 DB を直接変更して作り、終わったら元に戻す。
 */
test.describe.configure({ mode: "serial" });

const db = createPrismaClient(TEST_DATABASE_URL);
test.afterAll(async () => db.$disconnect());

const userId = async (email: string) => (await db.user.findUniqueOrThrow({ where: { email } })).id;

test("robots.txt はログインなしで返し、検索エンジンに載せない", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain("Disallow: /");
});

test("講師・管理者も、仮パスワードのままではダッシュボードや CSV を使えない", async ({ page }) => {
  const id = await userId("instructor2@its.example");
  await db.user.update({ where: { id }, data: { mustChangePassword: true } });
  try {
    await login(page, "instructor2@its.example");
    await page.waitForURL(/\/me\?changePassword=1$/);
    for (const path of ["/admin", "/admin/reviews", "/admin/students"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/me\?changePassword=1$/);
    }
    const csv = await page.request.get("/admin/export/students");
    expect(csv.headers()["content-type"] ?? "").not.toContain("text/csv");
  } finally {
    await db.user.update({ where: { id }, data: { mustChangePassword: false } });
  }
});

test("講師は担当外の受講生の提出を開けず、CSV にも含まれない", async ({ page }) => {
  // 鈴木 美咲 (student3) は講師 二葉の担当。講師 一郎からは見えないことを確かめる
  const misaki = await userId("student3@its.example");
  const assignment = await db.assignment.findUniqueOrThrow({ where: { slug: "a1-github-profile" } });
  const sub = await db.submission.create({
    data: { assignmentId: assignment.id, userId: misaki, attemptNo: 99, status: "SUBMITTED", repoUrl: "https://github.com/example/its-profile", submittedAt: new Date() },
  });
  try {
    await login(page, "instructor@its.example");
    await page.waitForURL(/\/admin$/);
    // ロールでは開ける画面のため、データの確認はストリーミング中に行われ、HTTP ステータスは 200 のまま 404 の画面になる
    await page.goto(`/admin/reviews/${sub.id}`);
    await expect(page.getByRole("heading", { name: "ページが見つかりません" })).toBeVisible();
    await expect(page.getByText("鈴木 美咲")).toHaveCount(0);
    await page.goto("/admin/reviews");
    await expect(page.getByText("鈴木 美咲")).toHaveCount(0);
    const csv = await (await page.request.get("/admin/export/students")).text();
    expect(csv).toContain("山田 花子");
    expect(csv).not.toContain("鈴木 美咲");
  } finally {
    await db.submission.delete({ where: { id: sub.id } });
  }
});

test("ログインから 30 日を過ぎたセッションは使えず、ログインし直しになる", async ({ page }) => {
  await login(page, "student@its.example");
  await page.waitForURL(/\/home$/);
  await db.session.updateMany({ where: { userId: await userId("student@its.example") }, data: { createdAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000) } });
  await page.goto("/progress");
  await expect(page).toHaveURL(/\/login$/);
});

test("休止中の受講生は課題を提出できない (教材は読める)", async ({ page }) => {
  // 高橋 陽太 (student4) が課題 1 の前提レッスンを終えた状態を作り、受講状態を休止中にする
  const yota = await userId("student4@its.example");
  const lesson = await db.lesson.findUniqueOrThrow({ where: { slug: "l1-github-setup" } });
  const progress = await db.lessonProgress.create({
    data: { userId: yota, lessonId: lesson.id, lessonVersionId: lesson.currentVersionId!, status: "COMPLETED", completedAt: new Date(), completedVersionId: lesson.currentVersionId },
  });
  await db.enrollment.updateMany({ where: { userId: yota }, data: { status: "PAUSED" } });
  try {
    await login(page, "student4@its.example");
    await page.waitForURL(/\/home$/);
    await page.goto("/lessons/l1-github-setup");
    await expect(page.locator("main h1:visible")).toBeVisible();
    await page.goto("/assignments/a1-github-profile");
    await page.getByLabel("GitHub リポジトリの URL").fill("https://github.com/yota/its-profile");
    await page.getByRole("button", { name: "提出する" }).click();
    await expect(page.getByText("受講状態が「休止中」または「退校」のため提出できません")).toBeVisible();
    expect(await db.submission.count({ where: { userId: yota } })).toBe(0);
  } finally {
    await db.enrollment.updateMany({ where: { userId: yota }, data: { status: "ACTIVE" } });
    await db.lessonProgress.delete({ where: { id: progress.id } });
  }
});

test("理解度チェックを解いている間に教材が更新されたら、古い問題への回答では採点しない", async ({ page }) => {
  const lesson = await db.lesson.findUniqueOrThrow({ where: { slug: "l0-how-to-learn" }, include: { currentVersion: true } });
  const old = lesson.currentVersion!;
  await login(page, "student@its.example");
  await page.waitForURL(/\/home$/);
  await page.goto("/lessons/l0-how-to-learn");
  const groups = page.getByRole("group", { name: /^問 \d+\./ });
  await expect(groups.first()).toBeVisible();
  for (const group of await groups.all()) await group.getByRole("radio").first().check();
  await expect(page.getByRole("button", { name: "採点する" })).toBeEnabled();

  // 画面を開いた後に新しい版を公開する
  const next = await db.lessonVersion.create({
    data: { lessonId: lesson.id, version: 900, title: old.title, estimatedMinutes: old.estimatedMinutes, content: old.content ?? {}, publishedAt: new Date() },
  });
  await db.lesson.update({ where: { id: lesson.id }, data: { currentVersionId: next.id } });
  try {
    await page.getByRole("button", { name: "採点する" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "このレッスンの内容が更新されました" })).toBeVisible();
    expect(await db.quizAttempt.count({ where: { lessonVersionId: next.id } })).toBe(0);
  } finally {
    await db.lesson.update({ where: { id: lesson.id }, data: { currentVersionId: old.id } });
    // 画面を開いている間の学習記録が新しい版を指していれば、元の版に戻してから削除する
    await db.lessonProgress.updateMany({ where: { lessonVersionId: next.id }, data: { lessonVersionId: old.id } });
    await db.lessonVersion.delete({ where: { id: next.id } });
  }
});
