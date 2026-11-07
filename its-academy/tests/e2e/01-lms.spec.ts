import { expect, test } from "./fixtures";
import { login, logout, PASSWORD } from "./helpers";

test.describe.configure({ mode: "serial" });

test("ログイン失敗時は、どちらが誤りかを明かさないメッセージを出す", async ({ page }) => {
  await login(page, "student@its.example", "wrong-password");
  await expect(page.getByRole("alert").filter({ hasText: "正しくありません" })).toHaveText("メールアドレスまたはパスワードが正しくありません。");
  // 入れ直さなくて済むようメールアドレスは残し、パスワードは消す
  await expect(page.getByLabel("メールアドレス")).toHaveValue("student@its.example");
  await expect(page.getByLabel("パスワード")).toHaveValue("");
  await login(page, "nobody@its.example", "wrong-password");
  await expect(page.getByRole("alert").filter({ hasText: "正しくありません" })).toHaveText("メールアドレスまたはパスワードが正しくありません。");
});

test("未ログインで保護ページを開くとログイン画面へ。ログインすると開こうとしたページに戻る", async ({ page }) => {
  await page.goto("/home");
  await expect(page).toHaveURL(/\/login\?next=%2Fhome$/);
  await page.goto("/admin/students");
  await expect(page).toHaveURL(/\/login\?next=%2Fadmin%2Fstudents$/);
  await page.goto("/lessons/l2-conditionals");
  await page.getByLabel("メールアドレス").fill("student@its.example");
  await page.getByLabel("パスワード").fill(PASSWORD);
  await page.getByRole("button", { name: "ログイン" }).click();
  await page.waitForURL(/\/lessons\/l2-conditionals$/);
  await logout(page);
});

test("受講生: 前回の続きから再開し、理解度チェック合格後に学習完了できる (DB に保存される)", async ({ page }) => {
  await login(page, "student@its.example");
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByText("次にやること")).toBeVisible();
  await expect(page.getByRole("heading", { name: "繰り返しと配列" })).toBeVisible();
  await page.getByRole("link", { name: "続きから学習する" }).click();
  await expect(page).toHaveURL(/\/lessons\/l2-loops-arrays$/);

  // 13 項目の主要セクションが表示される
  for (const h of ["このレッスンでできるようになること", "動作するサンプルコードと実行結果", "自分で試す演習", "理解度チェック", "よくあるエラー", "復習ポイント"]) {
    await expect(page.getByRole("heading", { name: h })).toBeVisible();
  }
  await expect(page.getByText("学習目安 90 分")).toBeVisible();

  // ページを開いただけでは完了にできない
  const complete = page.getByRole("button", { name: "学習完了にする" });
  await expect(complete).toBeDisabled();

  // 不正解 → 不合格
  const q = (n: number) => page.getByRole("group", { name: new RegExp(`^問 ${n}\\.`) });
  await q(1).getByLabel("30 が返る").check();
  await q(2).getByLabel("速く計算するため").check();
  await q(3).getByLabel("問題ない").check();
  await page.getByRole("button", { name: "採点する" }).click();
  await expect(page.getByText("0 点 — 合格ラインに届きませんでした")).toBeVisible();
  await expect(complete).toBeDisabled();
  // 不合格のときは、どれが正解かと解説を見せない (答えを写して合格できないように)
  await expect(page.getByText("不正解", { exact: true })).toHaveCount(3);
  await expect(page.getByText("正解", { exact: true })).toHaveCount(0);

  // 正解 → 合格 → 完了
  await q(1).getByLabel("ArrayIndexOutOfBoundsException が発生する").check();
  await q(2).getByLabel("整数の割り算で小数点以下が切り捨てられるのを防ぐため").check();
  await q(3).getByLabel("最後に範囲外の添え字を参照する").check();
  await page.getByRole("button", { name: "採点する" }).click();
  await expect(page.getByText("100 点 — 合格です")).toBeVisible();
  // 合格すると、正解と解説が表示される
  await expect(page.getByText("正解", { exact: true })).toHaveCount(3);
  await page.reload();
  await page.getByRole("button", { name: "学習完了にする" }).click();
  await expect(page.getByText("このレッスンは学習完了です。")).toBeVisible();

  // 再読み込みしても完了のまま (永続化)
  await page.reload();
  await expect(page.getByText("このレッスンは学習完了です。")).toBeVisible();

  // 次のレッスンへの導線と、進捗画面への反映
  await expect(page.getByRole("link", { name: /次のレッスン: メソッド/ })).toBeVisible();
  await page.goto("/progress");
  await expect(page.getByText("8 / 30 レッスン")).toBeVisible(); // 任意の L8 (5 レッスン) は必修の分母に含めない
  await page.goto("/curriculum");
  await expect(page.getByRole("heading", { name: /L8\s*AI 駆動開発 \(発展\)/ })).toBeVisible();
  await expect(page.getByText("任意 (発展)")).toBeVisible();
  await logout(page);
});

test("受講生は管理画面・他人のデータを開けない", async ({ page }) => {
  await login(page, "student@its.example");
  await page.waitForURL(/\/home$/);
  // 管理者・講師のエリアは描画前 (proxy) にロールを確認し、本当の 404 を返す。
  // あわせて「他人のデータが HTML に一切含まれない」ことも確かめる (docs/architecture.md 参照)
  for (const path of ["/admin", "/admin/students", "/admin/reviews", "/admin/settings", "/admin/students/not-a-real-id"]) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(404);
    await expect(page.getByRole("heading", { name: "ページが見つかりません" }), path).toBeVisible();
    const html = (await res?.text()) ?? "";
    expect(html, path).not.toMatch(/佐藤 健|鈴木 美咲|student2@its\.example|監査ログ/);
  }
  const csv = await page.request.get("/admin/export/students");
  expect(csv.status()).toBe(404);
});

test("修正依頼 → 再提出 → 講師がルーブリックで採点 → 受講生に合格が表示される", async ({ page }) => {
  // 受講生 (佐藤) が修正版を再提出
  await login(page, "student2@its.example");
  await page.waitForURL(/\/home$/);
  await expect(page.getByText("修正依頼: 成績判定プログラム")).toBeVisible();
  await page.getByRole("link", { name: "コメントを確認する" }).click();
  await expect(page.getByText("前回 (1 回目) のレビュー")).toBeVisible();
  await page.getByLabel("提出するコード・回答").fill(
    'public class Main {\n    static String grade(int score) {\n        if (score >= 80) return "A";\n        if (score >= 60) return "B";\n        return "C";\n    }\n}',
  );
  await page.getByLabel("備考").fill("境界値 (59, 60, 79, 80) で確認しました。AI は使用していません。");
  await page.getByRole("button", { name: "提出する" }).click();
  await expect(page.getByRole("status").filter({ hasText: "2 回目の提出を受け付けました" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("status").filter({ hasText: "2 回目の提出を受け付けました" })).toBeVisible(); // 永続化
  await logout(page);

  // 担当講師が採点
  await login(page, "instructor@its.example");
  await page.waitForURL(/\/admin$/);
  await page.goto("/admin/reviews");
  await page.getByRole("link", { name: "成績判定プログラム" }).click();
  await expect(page.getByText("境界値 (59, 60, 79, 80) で確認しました。")).toBeVisible();
  const scores: Record<string, string> = { 要件充足: "22", 正確性: "18", 可読性: "12", 保守性: "8", テスト: "7", セキュリティ: "8", 説明能力: "7" };
  for (const [label, v] of Object.entries(scores)) {
    await page.getByLabel(new RegExp(`^${label} \\(0〜`)).fill(v);
  }
  await expect(page.getByText("合計 82 / 100 点")).toBeVisible();
  await page.getByLabel("判定").selectOption("PASS");
  await page.getByLabel("コメント (受講生に表示されます)").fill("境界値がすべて仕様どおりになりました。次は統計の表示をメソッドに分けてみましょう。");
  await page.getByRole("button", { name: "採点を確定する" }).click();
  await expect(page.getByRole("status").filter({ hasText: "この提出は採点済みです" })).toBeVisible();
  await expect(page.getByText("82 点 (合格点 70 点)").first()).toBeVisible();
  await logout(page);

  // 受講生に結果が届く
  await login(page, "student2@its.example");
  await page.waitForURL(/\/home$/);
  await page.goto("/assignments");
  await expect(page.getByRole("row", { name: /成績判定プログラム/ }).getByText("合格", { exact: true })).toBeVisible();
  await page.goto("/reviews");
  await expect(page.getByText("境界値がすべて仕様どおりになりました。")).toBeVisible();
  await logout(page);
});

test("講師: 担当外の受講生は閲覧できず、停滞の可能性は担当講師に表示される", async ({ page }) => {
  // 管理者画面から鈴木さん (講師 二葉の担当) の詳細 URL を取得
  await login(page, "admin@its.example");
  await page.waitForURL(/\/admin$/);
  await page.goto("/admin/students");
  const misakiUrl = await page.getByRole("link", { name: "鈴木 美咲" }).getAttribute("href");
  expect(misakiUrl).toMatch(/^\/admin\/students\/c/);
  await logout(page);

  await login(page, "instructor@its.example");
  await page.waitForURL(/\/admin$/);
  const res = await page.goto(misakiUrl!);
  await expect(page.getByRole("heading", { name: "ページが見つかりません" })).toBeVisible();
  expect(await res!.text()).not.toContain("L1 Git の理解度チェックで止まっている");
  await page.goto("/admin/students");
  await expect(page.getByRole("link", { name: "山田 花子" })).toBeVisible();
  await expect(page.getByRole("link", { name: "鈴木 美咲" })).toHaveCount(0);
  await logout(page);

  await login(page, "instructor2@its.example");
  await page.waitForURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "学習停滞の可能性がある受講生" })).toBeVisible();
  await expect(page.getByRole("link", { name: "鈴木 美咲" }).first()).toBeVisible();
  await page.getByRole("link", { name: "鈴木 美咲" }).first().click();
  await expect(page.getByText(/最終学習から 9 日経過しています/)).toBeVisible();
  await logout(page);
});

test("管理者: 停滞の閾値を変更でき、CSV を出力できる", async ({ page }) => {
  await login(page, "admin@its.example");
  await page.waitForURL(/\/admin$/);
  await page.goto("/admin/settings");
  await page.getByLabel("学習停滞とみなす日数").fill("10");
  await page.getByRole("button", { name: "保存" }).click();
  await expect(page.getByText("設定を保存しました。")).toBeVisible();
  await page.goto("/admin");
  await expect(page.getByText("該当者はいません。")).toBeVisible(); // 鈴木さんは 9 日なので閾値 10 日では対象外

  const res = await page.request.get("/admin/export/students");
  expect(res.status()).toBe(200);
  const text = await res.text();
  expect(text.startsWith("﻿ユーザー ID,氏名")).toBe(true);
  expect(text).toContain("鈴木 美咲");

  await page.goto("/admin/settings");
  await expect(page.getByText("export.students_csv")).toBeVisible(); // 監査ログ
});

test("スマホ〜PC 幅で横スクロールが発生しない", async ({ page }) => {
  await login(page, "student@its.example");
  await page.waitForURL(/\/home$/);
  for (const width of [375, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/home", "/curriculum", "/lessons/l2-methods", "/assignments", "/progress", "/me"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${path} @ ${width}px`).toBeLessThanOrEqual(0);
    }
  }
});
