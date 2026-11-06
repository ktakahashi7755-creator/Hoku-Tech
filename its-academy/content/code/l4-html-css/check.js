// 検証用: ブラウザ (Chromium) で表示し、画面幅ごとのレイアウトとアクセシビリティを確かめる
const { chromium } = require("@playwright/test");
const path = require("node:path");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("file://" + path.resolve("index.html"));

  for (const width of [375, 1024]) {
    await page.setViewportSize({ width, height: 800 });
    const r = await page.evaluate(() => {
      const cards = [...document.querySelectorAll(".card")].map((c) => c.getBoundingClientRect());
      return {
        sameRow: cards.every((c) => c.top === cards[0].top),
        width: Math.round(cards[0].width),
        overflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    console.log(`${width}px: カード ${r.sameRow ? "横並び" : "縦並び"} / 1 枚の幅 ${r.width}px / 横スクロール ${r.overflow ? "あり" : "なし"}`);
  }

  const a11y = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    headings: [...document.querySelectorAll("h1, h2, h3")].map((h) => h.tagName.toLowerCase()).join(" > "),
    labeled: [...document.querySelectorAll("input")].every((i) => i.labels.length > 0),
    landmarks: ["header", "nav", "main", "footer"].filter((t) => document.querySelector(t)).join(", "),
  }));
  console.log(`lang: ${a11y.lang}`);
  console.log(`見出しの順序: ${a11y.headings}`);
  console.log(`すべての入力欄にラベル: ${a11y.labeled ? "あり" : "なし"}`);
  console.log(`ランドマーク: ${a11y.landmarks}`);
  await browser.close();
})();
