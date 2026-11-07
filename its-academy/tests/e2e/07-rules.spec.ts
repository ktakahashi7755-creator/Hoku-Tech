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

test("提出の前に入力の誤りを知らせ (確認ダイアログは出さない)、入力途中の URL でも下書きは保存できる", async ({ page }) => {
  const yota = await userId("student4@its.example");
  const lesson = await db.lesson.findUniqueOrThrow({ where: { slug: "l1-github-setup" } });
  const progress = await db.lessonProgress.create({
    data: { userId: yota, lessonId: lesson.id, lessonVersionId: lesson.currentVersionId!, status: "COMPLETED", completedAt: new Date(), completedVersionId: lesson.currentVersionId },
  });
  const dialogs: string[] = [];
  page.on("dialog", (d) => dialogs.push(d.message()));
  try {
    await login(page, "student4@its.example");
    await page.waitForURL(/\/home$/);
    await page.goto("/assignments/a1-github-profile");
    const url = page.getByLabel("GitHub リポジトリの URL");
    await url.fill("https://github.com/yota");
    await page.getByRole("button", { name: "提出する" }).click();
    // 入力欄の誤りとして知らせ、取り消せない操作の確認は出さない
    expect(await url.evaluate((el: HTMLInputElement) => el.validationMessage)).toContain("https://github.com/ユーザー名/リポジトリ名");
    expect(dialogs).toHaveLength(0);
    // 同じ入力のまま、下書きは保存できる
    await page.getByRole("button", { name: "下書き保存" }).click();
    await expect(page.getByText("下書きを保存しました。")).toBeVisible();
    expect(await db.submission.count({ where: { userId: yota, status: "DRAFT" } })).toBe(1);
  } finally {
    await db.submission.deleteMany({ where: { userId: yota } });
    await db.lessonProgress.delete({ where: { id: progress.id } });
  }
});

test("同じレッスンを 2 つの画面で編集したとき、後から保存した側は上書きせずに知らせる", async ({ page, context }) => {
  const lesson = await db.lesson.findUniqueOrThrow({ where: { slug: "l1-terminal-basics" } });
  const before = await db.lessonVersion.count({ where: { lessonId: lesson.id } });
  try {
    await login(page, "admin@its.example");
    await page.waitForURL(/\/admin$/);
    const other = await context.newPage();
    await page.goto(`/admin/content/lessons/${lesson.id}`);
    await other.goto(`/admin/content/lessons/${lesson.id}`);

    await page.locator("#title").fill("ターミナルの基本操作 (画面 A)");
    await page.getByRole("button", { name: "下書きを保存" }).click();
    await expect(page.getByRole("status").filter({ hasText: "を保存しました" })).toBeVisible();

    // 古い内容のままの画面 B から保存すると、上書きせずに知らせる
    await other.locator("#title").fill("ターミナルの基本操作 (画面 B)");
    await other.getByRole("button", { name: "下書きを保存" }).click();
    await expect(other.getByRole("alert").filter({ hasText: "先に保存しました" })).toBeVisible();
    const latest = await db.lessonVersion.findFirstOrThrow({ where: { lessonId: lesson.id }, orderBy: { version: "desc" } });
    expect(latest.title).toBe("ターミナルの基本操作 (画面 A)");
  } finally {
    await db.lessonVersion.deleteMany({ where: { lessonId: lesson.id, publishedAt: null } });
    expect(await db.lessonVersion.count({ where: { lessonId: lesson.id } })).toBe(before);
  }
});

test("予約した後に編集して保存しても衝突にならず、公開の結果は古い保存のメッセージを置き換える", async ({ page }) => {
  const lesson = await db.lesson.findUniqueOrThrow({ where: { slug: "l1-terminal-basics" } });
  const original = { currentVersionId: lesson.currentVersionId, scheduledVersionId: lesson.scheduledVersionId, publishAt: lesson.publishAt, status: lesson.status };
  const before = await db.lessonVersion.findMany({ where: { lessonId: lesson.id }, select: { id: true } });
  try {
    await login(page, "admin@its.example");
    await page.waitForURL(/\/admin$/);
    await page.goto(`/admin/content/lessons/${lesson.id}`);
    await page.locator("#title").fill("ターミナルの基本操作 (予約する版)");
    await page.getByRole("button", { name: "下書きを保存" }).click();
    await expect(page.getByRole("status").filter({ hasText: "を保存しました" })).toBeVisible();

    await page.getByLabel("公開を予約する (日本時間)").fill("2099-01-01T09:00");
    await page.getByRole("button", { name: "予約する" }).click();
    await expect(page.getByRole("status").filter({ hasText: "公開を予約しました" })).toBeVisible();
    // 保存のときのメッセージは古くなったので消える
    await expect(page.getByText(/を保存しました。受講生にはまだ表示されません/)).toHaveCount(0);

    // 予約した版の後に編集して保存しても、自分の予約を「ほかの画面の保存」と取り違えない (再読み込みの後も)
    await page.reload();
    await page.locator("#title").fill("ターミナルの基本操作 (次の版)");
    await page.getByRole("button", { name: "下書きを保存" }).click();
    await expect(page.getByRole("status").filter({ hasText: "を保存しました" })).toBeVisible();
    await expect(page.getByText("先に保存しました")).toHaveCount(0);

    // 予約は 1 つだけ。取り消すと、新しい下書きを公開できる。予約していた版は「未公開」として残り、下書きは 1 つだけ
    await page.getByRole("button", { name: "予約を取り消す" }).click();
    await expect(page.getByRole("status").filter({ hasText: "公開の予約を取り消しました" })).toBeVisible();
    await expect(page.getByText("下書き", { exact: true })).toHaveCount(1);
    await expect(page.getByText("未公開", { exact: true })).toHaveCount(1);

    await page.getByRole("button", { name: "今すぐ公開する" }).click();
    await expect(page.getByRole("status").filter({ hasText: /版 \d+ を公開しました/ })).toBeVisible();
    await expect(page.getByText(/を保存しました。受講生にはまだ表示されません/)).toHaveCount(0);
    // 結果のメッセージにフォーカスが残る (押したボタンが消えても、Tab が先頭からやり直しにならない)
    expect(await page.evaluate(() => document.activeElement !== document.body)).toBe(true);

    // 一覧から別のレッスンを開いても、前のレッスンの結果は表示されない (画面内の移動)
    await page.getByRole("link", { name: "一覧へ戻る" }).click();
    await page.waitForURL(/\/admin\/content$/);
    await page.getByRole("link", { name: "変数とデータ型" }).first().click();
    await page.waitForURL(/\/admin\/content\/lessons\//);
    // 前の画面は非表示のまま DOM に残ることがある (Next.js が戻る操作のために保持する) ため、表示中のものだけを見る
    await expect(page.getByRole("heading", { level: 1, name: "変数とデータ型" })).toBeVisible();
    await expect(page.getByText(/を公開しました/).filter({ visible: true })).toHaveCount(0);
  } finally {
    await db.lesson.update({ where: { id: lesson.id }, data: original });
    await db.lessonVersion.deleteMany({ where: { lessonId: lesson.id, id: { notIn: before.map((v) => v.id) } } });
  }
});

test("パスワードの変更で現在のパスワードが違うと、その欄にフォーカスが移る", async ({ page }) => {
  // ほかのテストがパスワードを変えないアカウントを使う
  await login(page, "student2@its.example");
  await page.waitForURL(/\/home$/);
  await page.goto("/me");
  await page.getByLabel("現在のパスワード").fill("wrong-password-123");
  await page.getByLabel("新しいパスワード", { exact: true }).fill("another-password-456");
  await page.getByLabel("新しいパスワード (確認)").fill("another-password-456");
  await page.getByRole("button", { name: "変更する" }).click();
  await expect(page.locator("#current-error")).toBeVisible();
  await expect(page.getByLabel("現在のパスワード")).toBeFocused();
});

test("採点・監査ログ・スキル評価は、データベースでも書き換え・削除できない (追記のみ)", async () => {
  const review = await db.review.findFirstOrThrow();
  await expect(db.review.update({ where: { id: review.id }, data: { comment: "書き換え" } })).rejects.toThrow(/追記のみ/);
  await expect(db.review.delete({ where: { id: review.id } })).rejects.toThrow(/追記のみ/);
  const log = await db.auditLog.findFirstOrThrow();
  await expect(db.auditLog.delete({ where: { id: log.id } })).rejects.toThrow(/追記のみ/);
});

test("お知らせは、まだ見ていないものに「新着」を付け、表示した後は外す", async ({ page }) => {
  const student = await userId("student2@its.example");
  const notice = await db.notification.create({ data: { userId: student, title: "テストのお知らせ", body: "新着の確認", link: "/reviews" } });
  try {
    await login(page, "student2@its.example");
    await page.waitForURL(/\/home$/);
    await page.goto("/reviews");
    const item = page.getByRole("listitem").filter({ hasText: "テストのお知らせ" });
    await expect(item.getByText("新着", { exact: true })).toBeVisible();
    await expect.poll(async () => (await db.notification.findUniqueOrThrow({ where: { id: notice.id } })).readAt).not.toBeNull();
    await page.reload();
    await expect(item).toBeVisible();
    await expect(item.getByText("新着", { exact: true })).toHaveCount(0);
  } finally {
    await db.notification.delete({ where: { id: notice.id } });
  }
});

test("通信が切れて送信に失敗しても、画面は消えず入力も残る", async ({ page }) => {
  await login(page, "student2@its.example");
  await page.waitForURL(/\/home$/);
  await page.goto("/me");
  await page.getByLabel("現在のパスワード").fill("typed-current-password");
  // サーバーアクションの送信 (POST) だけを失敗させる
  await page.route("**/me*", (route) => (route.request().method() === "POST" ? route.abort("internetdisconnected") : route.continue()));
  await page.getByLabel("新しいパスワード", { exact: true }).fill("another-password-456");
  await page.getByLabel("新しいパスワード (確認)").fill("another-password-456");
  await page.getByRole("button", { name: "変更する" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "送信できませんでした" })).toBeVisible();
  await expect(page.getByLabel("現在のパスワード")).toHaveValue("typed-current-password");
  await expect(page.getByText("画面を表示できませんでした")).toHaveCount(0);
});

test("ログインに失敗したら、パスワード欄にフォーカスが移る", async ({ page }) => {
  await login(page, "student2@its.example", "wrong-password-focus");
  await expect(page.getByRole("alert").filter({ hasText: "正しくありません" })).toBeVisible();
  await expect(page.getByLabel("パスワード")).toBeFocused();
});

test("目標修了日は入校日より後の日付だけ受け付ける", async ({ page }) => {
  await login(page, "admin@its.example");
  await page.waitForURL(/\/admin$/);
  await page.goto("/admin/students/new");
  await page.getByLabel("氏名").fill("日付 確認");
  await page.getByLabel("メールアドレス").fill(`date-${Date.now()}@its.example`);
  await page.getByLabel("入校日").fill("2026-11-07");
  await page.getByLabel("目標修了日 (学習期限)").fill("2026-10-01");
  await page.getByRole("button", { name: "追加する" }).click();
  await expect(page.getByText("入校日より後の日付にしてください")).toBeVisible();
  // 直すと、古い誤りの表示は消える
  await page.getByLabel("目標修了日 (学習期限)").fill("2027-02-01");
  await expect(page.getByText("入校日より後の日付にしてください")).toBeHidden();
});
