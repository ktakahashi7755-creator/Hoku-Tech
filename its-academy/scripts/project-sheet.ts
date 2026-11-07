/**
 * チームのスプレッドシートを、リポジトリの文書と教材の定義から作り直す。
 *
 *   npm run sheet -- --out <フォルダ>   各タブを CSV と JSON に書き出す (確認用・Google への接続なし)
 *   npm run sheet -- --json <ファイル>  スプレッドシートの Apps Script が読み込むデータを書き出す (docs/project-sheet.md)
 *   npm run sheet -- --push             Google スプレッドシートへ反映する (サービスアカウントを使う方法)
 *
 * --push に必要な環境変数 (GitHub Actions では Secrets / Variables に置く。リポジトリには書かない):
 *   PROJECT_SHEET_ID                 スプレッドシートの ID (URL の /d/ と /edit の間)
 *   GOOGLE_SERVICE_ACCOUNT_KEY       サービスアカウントの鍵 (JSON の中身そのもの)
 * 手順: docs/project-sheet.md
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadLocalEnv } from "./load-env";
import { buildTabs, gitReader, TEAM_TAB, type Cell } from "./project-sheet/build";
import { accessToken, syncSpreadsheet, tableValues, type ServiceAccount } from "./project-sheet/sheets";

loadLocalEnv();
const REPO_ROOT = path.resolve(__dirname, "../..");

const csv = (rows: Cell[][]) => rows.map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(",")).join("\n") + "\n";

async function main() {
  const args = process.argv.slice(2);
  const tabs = buildTabs(REPO_ROOT);
  const outIndex = args.indexOf("--out");
  if (outIndex >= 0) {
    const dir = path.resolve(args[outIndex + 1] ?? "project-sheet-out");
    mkdirSync(dir, { recursive: true });
    tabs.forEach((t, i) => writeFileSync(path.join(dir, `${String(i + 1).padStart(2, "0")}-${t.name}.csv`), "﻿" + csv(tableValues(t))));
    writeFileSync(path.join(dir, "tabs.json"), JSON.stringify(tabs, null, 1));
    console.log(`${tabs.length} タブを書き出しました: ${dir}`);
  }
  const jsonIndex = args.indexOf("--json");
  if (jsonIndex >= 0) {
    const file = path.resolve(args[jsonIndex + 1] ?? "project-sheet.json");
    mkdirSync(path.dirname(file), { recursive: true });
    // 書き出した日時は入れない (内容が同じなら同じファイルになり、余計な更新をしない)
    const data = { version: 1, commit: gitReader(REPO_ROOT).head(), teamTab: TEAM_TAB, tabs };
    writeFileSync(file, JSON.stringify(data));
    console.log(`データを書き出しました: ${file}`);
  }
  if (args.includes("--push")) {
    const id = process.env.PROJECT_SHEET_ID;
    const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!id || !key) {
      console.log("PROJECT_SHEET_ID と GOOGLE_SERVICE_ACCOUNT_KEY が設定されていないため、スプレッドシートの更新を飛ばしました (docs/project-sheet.md)。");
      return;
    }
    let sa: ServiceAccount;
    try {
      sa = JSON.parse(key) as ServiceAccount;
    } catch {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY が JSON として読めません。鍵ファイルの中身をそのまま設定してください");
    }
    const token = await accessToken(sa);
    const r = await syncSpreadsheet(id, tabs, token);
    console.log(`スプレッドシートを更新しました: ${r.written.join(" / ")}`);
  }
  if (outIndex < 0 && jsonIndex < 0 && !args.includes("--push")) console.log("使い方: npm run sheet -- --out <フォルダ> | --json <ファイル> | --push");
}

main().catch((e: unknown) => {
  // 鍵やトークンは出さない (メッセージだけ)
  console.error(e instanceof Error ? e.message : "失敗しました");
  process.exit(1);
});
