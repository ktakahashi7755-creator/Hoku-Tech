// 検証用: ブラウザで画面を操作し、表示された内容を確かめる。API (/api/books) は偽の応答に差し替える
const { chromium } = require("@playwright/test");
const fs = require("node:fs");

const BOOKS = [
  { id: 1, title: "Java 入門", author: "山田" },
  { id: 2, title: '<img src=x onerror="window.hacked=true">', author: "攻撃者" },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.route("http://app.test/**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === "/api/books") {
      console.log(`  (サーバーが受け取った検索語: ${url.searchParams.get("title")})`);
      if (url.searchParams.get("title") === "エラー") return route.fulfill({ status: 500, body: "" });
      return route.fulfill({ json: BOOKS });
    }
    const file = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
    if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: "" }); // ない画像などは 404
    const type = file.endsWith(".js") ? "text/javascript" : "text/html";
    return route.fulfill({ body: fs.readFileSync(file, "utf8"), contentType: `${type}; charset=utf-8` });
  });
  await page.goto("http://app.test/");

  const search = async (text) => {
    await page.fill("#q", text);
    await page.click("button");
    await page.waitForFunction(() => !document.querySelector("#status").textContent.endsWith("…"));
  };

  console.log("1. 空のまま検索");
  await search("   ");
  console.log(`  エラー表示: ${await page.textContent("#error")}`);

  console.log("2. 日本語と記号を含む語で検索");
  await search("Java & SQL");
  console.log(`  ${await page.textContent("#status")}`);
  for (const li of await page.locator("#results li").allTextContents()) console.log(`  - ${li}`);
  console.log(`  タイトルの HTML は実行されたか: ${await page.evaluate(() => window.hacked === true)}`);

  console.log("3. サーバーがエラーを返した場合");
  await search("エラー");
  console.log(`  ${await page.textContent("#status")}`);

  console.log("4. 比較: innerHTML で同じタイトルを表示した場合 (やってはいけない例)");
  await page.evaluate((title) => {
    document.querySelector("#results").innerHTML = `<li>${title}</li>`;
  }, BOOKS[1].title);
  // 画像の読み込みに失敗すると onerror が動く。最大 5 秒待つ (動かなければ false のまま)
  await page.waitForFunction(() => window.hacked === true, null, { timeout: 5000 }).catch(() => {});
  console.log(`  タイトルの HTML は実行されたか: ${await page.evaluate(() => window.hacked === true)}`);
  await browser.close();
})();
