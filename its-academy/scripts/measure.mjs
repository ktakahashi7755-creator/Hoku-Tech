// 負荷試験: 管理者としてログインし、主要な画面の応答時間を計測する (1 回目は暖機運転として除外し、5 回の中央値と最大値)
// 使い方: node scripts/measure.mjs http://localhost:3300
import { chromium } from "@playwright/test";

const BASE = process.argv[2] ?? "http://localhost:3300";
const browser = await chromium.launch();
async function session(email, password) {
  const page = await browser.newPage();
  await page.goto(`${BASE}/login`);
  await page.fill("#email", email);
  await page.fill("#password", password);
  await Promise.all([page.waitForURL(/(home|admin)$/), page.click("button[type=submit]")]);
  return page;
}
async function measure(page, path) {
  const times = [];
  for (let i = 0; i < 6; i++) {
    const t = performance.now();
    const res = await page.request.get(BASE + path);
    await res.body();
    if (i > 0) times.push(performance.now() - t);
    if (res.status() !== 200) throw new Error(`${path}: ${res.status()}`);
  }
  times.sort((a, b) => a - b);
  console.log(`${path.padEnd(34)} 中央値 ${Math.round(times[2])} ms / 最大 ${Math.round(times[4])} ms`);
}
const admin = await session("admin@its.example", process.env.SEED_PASSWORD ?? "its-dev-password-2026");
for (const p of ["/admin", "/admin/students", "/admin/students?filter=stagnant", "/admin/reviews", "/admin/export/students"]) await measure(admin, p);
const student = await session("load10@its.example", "load-test-password");
for (const p of ["/home", "/progress", "/lessons/l3-collections"]) await measure(student, p);
await browser.close();

// 同時アクセス: 管理者の受講生一覧に 20 件のリクエストを同時に送る
{
  const b2 = await chromium.launch();
  const p = await b2.newPage();
  await p.goto(`${BASE}/login`);
  await p.fill("#email", "admin@its.example");
  await p.fill("#password", process.env.SEED_PASSWORD ?? "its-dev-password-2026");
  await Promise.all([p.waitForURL(/admin$/), p.click("button[type=submit]")]);
  const t = performance.now();
  const res = await Promise.all(Array.from({ length: 20 }, () => p.request.get(`${BASE}/admin/students`)));
  const ms = Math.round(performance.now() - t);
  console.log(`同時 20 件 /admin/students: 全件 ${res.every((r) => r.status() === 200) ? "200" : "失敗あり"} / 全体 ${ms} ms`);
  await b2.close();
}
