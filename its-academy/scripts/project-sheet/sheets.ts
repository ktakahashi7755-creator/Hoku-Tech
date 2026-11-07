/**
 * Google スプレッドシートへの書き込み (Sheets API v4 を直接呼ぶ。追加の依存関係なし)。
 *
 * - 認証: サービスアカウントの鍵で JWT を作り、アクセストークンに交換する (権限はスプレッドシートの読み書きだけ)
 * - 自動更新するタブは、毎回中身を書き直す。ただし「チームメモ」の列は、1 列目の ID ごとに書いた内容を残す
 * - 「チーム入力」タブは作るだけで、中身には触らない
 * - 自動更新するタブには「編集すると警告が出る」保護をかける (チームメモの列は除く)
 */
import { createSign } from "node:crypto";
import { TEAM_TAB, type Cell, type Tab } from "./build";

type Fetch = typeof fetch;
export type ServiceAccount = { client_email: string; private_key: string; token_uri?: string };

const API = "https://sheets.googleapis.com/v4/spreadsheets";
const DEFAULT_TABS = ["Sheet1", "シート1"];
const PROTECTION = "自動更新のタブ (変更はリポジトリの文書で行う)";
const STATUS_COLORS: [string, { red: number; green: number; blue: number }][] = [
  ["完了", { red: 0.85, green: 0.94, blue: 0.86 }],
  ["進行中", { red: 0.86, green: 0.91, blue: 0.99 }],
  ["回答待ち", { red: 1, green: 0.95, blue: 0.8 }],
  ["保留", { red: 1, green: 0.95, blue: 0.8 }],
  ["ブロック", { red: 0.99, green: 0.87, blue: 0.87 }],
];

const b64url = (s: string | Buffer) => Buffer.from(s).toString("base64url");

export async function accessToken(sa: ServiceAccount, f: Fetch = fetch, now = Date.now()): Promise<string> {
  const iat = Math.floor(now / 1000);
  const tokenUri = sa.token_uri ?? "https://oauth2.googleapis.com/token";
  const unsigned = `${b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${b64url(
    JSON.stringify({ iss: sa.client_email, scope: "https://www.googleapis.com/auth/spreadsheets", aud: tokenUri, iat, exp: iat + 600 }),
  )}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(sa.private_key);
  const res = await f(tokenUri, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${b64url(signature)}` }),
  });
  if (!res.ok) throw new Error(`アクセストークンを取得できませんでした (HTTP ${res.status})。鍵が正しいか確認してください`);
  return ((await res.json()) as { access_token: string }).access_token;
}

type SheetMeta = {
  properties: { sheetId: number; title: string };
  conditionalFormats?: unknown[];
  protectedRanges?: { protectedRangeId: number; description?: string }[];
};

export async function syncSpreadsheet(spreadsheetId: string, tabs: Tab[], token: string, f: Fetch = fetch): Promise<{ written: string[] }> {
  const call = async <T,>(method: string, url: string, body?: unknown): Promise<T> => {
    const res = await f(url, { method, headers: { authorization: `Bearer ${token}`, "content-type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
    if (!res.ok) {
      const hint = res.status === 403 || res.status === 404 ? " スプレッドシートの ID と、サービスアカウントに「編集者」で共有しているかを確認してください。" : "";
      throw new Error(`Sheets API ${method} が失敗しました (HTTP ${res.status}).${hint}`);
    }
    return (await res.json()) as T;
  };
  const base = `${API}/${encodeURIComponent(spreadsheetId)}`;
  const meta = async () =>
    (await call<{ sheets: SheetMeta[] }>("GET", `${base}?fields=${encodeURIComponent("sheets(properties(sheetId,title),conditionalFormats,protectedRanges(protectedRangeId,description))")}`)).sheets;

  // 1. 足りないタブを作る (チーム入力のタブも)
  let sheets = await meta();
  const titles = new Set(sheets.map((s) => s.properties.title));
  const missing = [...tabs.map((t) => t.name), TEAM_TAB.name].filter((n) => !titles.has(n));
  if (missing.length) {
    await call("POST", `${base}:batchUpdate`, { requests: missing.map((title) => ({ addSheet: { properties: { title } } })) });
    sheets = await meta();
  }
  if (missing.includes(TEAM_TAB.name)) {
    await call("PUT", `${base}/values/${encodeURIComponent(`'${TEAM_TAB.name}'!A1`)}?valueInputOption=RAW`, { values: [TEAM_TAB.header] });
  }
  const idOf = (title: string) => sheets.find((s) => s.properties.title === title)!.properties.sheetId;

  // 新しいスプレッドシートに最初からある空のタブ (Sheet1 / シート1) は、中身が空なら消す
  const defaults = sheets.filter((s) => DEFAULT_TABS.includes(s.properties.title));
  if (defaults.length) {
    const ranges = defaults.map((s) => `ranges=${encodeURIComponent(`'${s.properties.title}'!A1:Z100`)}`).join("&");
    const got = await call<{ valueRanges: { values?: string[][] }[] }>("GET", `${base}/values:batchGet?${ranges}`);
    const empty = defaults.filter((_, i) => !got.valueRanges[i]?.values?.length);
    if (empty.length) {
      await call("POST", `${base}:batchUpdate`, { requests: empty.map((s) => ({ deleteSheet: { sheetId: s.properties.sheetId } })) });
      sheets = sheets.filter((s) => !empty.includes(s));
    }
  }

  // 2. チームメモの列に書かれた内容を、ID ごとに読み取っておく
  const memoTabs = tabs.filter((t) => t.memoColumn);
  const memos = new Map<string, Map<string, string>>();
  if (memoTabs.length) {
    const ranges = memoTabs.map((t) => `ranges=${encodeURIComponent(`'${t.name}'!A1:Z5000`)}`).join("&");
    const got = await call<{ valueRanges: { values?: string[][] }[] }>("GET", `${base}/values:batchGet?${ranges}`);
    memoTabs.forEach((t, i) => memos.set(t.name, readMemos(got.valueRanges[i]?.values ?? [], t.memoColumn!)));
  }

  // 3. 中身を書き直す
  const data = tabs.map((t) => ({ range: `'${t.name}'!A1`, values: tableValues(t, memos.get(t.name)) }));
  await call("POST", `${base}/values:batchClear`, { ranges: tabs.map((t) => `'${t.name}'`) });
  await call("POST", `${base}/values:batchUpdate`, { valueInputOption: "RAW", data });

  // 4. 見た目と保護 (前回の色分けと保護を消してから付け直すので、何度実行しても増えない)
  const requests: unknown[] = [];
  // タブの並びを揃える (チーム入力は最後)
  [...tabs.map((t) => t.name), TEAM_TAB.name].forEach((title, index) =>
    requests.push({ updateSheetProperties: { properties: { sheetId: idOf(title), index }, fields: "index" } }),
  );
  for (const t of tabs) {
    const sheetId = idOf(t.name);
    const s = sheets.find((x) => x.properties.sheetId === sheetId)!;
    for (let i = (s.conditionalFormats?.length ?? 0) - 1; i >= 0; i--) requests.push({ deleteConditionalFormatRule: { sheetId, index: i } });
    for (const p of s.protectedRanges ?? []) if (p.description === PROTECTION) requests.push({ deleteProtectedRange: { protectedRangeId: p.protectedRangeId } });
    requests.push(...formatRequests(t, sheetId));
  }
  await call("POST", `${base}:batchUpdate`, { requests });
  return { written: tabs.map((t) => t.name) };
}

/** シートの値 (1 行目は説明、2 行目は見出し) から、ID → チームメモ を読む */
export function readMemos(values: string[][], memoColumn: string): Map<string, string> {
  const out = new Map<string, string>();
  const headerRow = values.findIndex((r) => r.includes(memoColumn));
  if (headerRow < 0) return out;
  const col = values[headerRow].indexOf(memoColumn);
  for (const row of values.slice(headerRow + 1)) {
    const id = row[0]?.trim();
    const memo = row[col]?.trim();
    if (id && memo) out.set(id, memo);
  }
  return out;
}

/** 1 行目に説明、2 行目に見出し、3 行目から中身。チームメモの列には残しておいた内容を戻す */
export function tableValues(t: Tab, memos?: Map<string, string>): Cell[][] {
  const col = t.memoColumn ? t.header.indexOf(t.memoColumn) : -1;
  const rows = t.rows.map((r) => (col >= 0 ? r.map((c, i) => (i === col ? (memos?.get(String(r[0])) ?? c) : c)) : r));
  // ID がなくなった行のメモは捨てずに、表の下に残す (誤って消さないため)
  const orphans = col >= 0 && memos ? [...memos].filter(([id]) => !t.rows.some((r) => String(r[0]) === id)) : [];
  const tail = orphans.length ? [[], ["(行がなくなった項目のメモ)"], ...orphans.map(([id, memo]) => t.header.map((_, i) => (i === 0 ? id : i === col ? memo : "")))] : [];
  return [[t.note], t.header, ...rows, ...tail];
}

function formatRequests(t: Tab, sheetId: number): unknown[] {
  const cols = t.header.length;
  const memoCol = t.memoColumn ? t.header.indexOf(t.memoColumn) : -1;
  const statusCol = t.statusColumn ? t.header.indexOf(t.statusColumn) : -1;
  const reqs: unknown[] = [
    { updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 2 } }, fields: "gridProperties.frozenRowCount" } },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
        cell: { userEnteredFormat: { textFormat: { italic: true, foregroundColor: { red: 0.4, green: 0.4, blue: 0.4 } }, wrapStrategy: "CLIP" } },
        fields: "userEnteredFormat.textFormat.italic,userEnteredFormat.textFormat.foregroundColor,userEnteredFormat.wrapStrategy",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: cols },
        cell: { userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.9, green: 0.92, blue: 0.96 }, wrapStrategy: "WRAP", verticalAlignment: "MIDDLE" } },
        fields: "userEnteredFormat.textFormat.bold,userEnteredFormat.backgroundColor,userEnteredFormat.wrapStrategy,userEnteredFormat.verticalAlignment",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 2, startColumnIndex: 0, endColumnIndex: cols },
        cell: { userEnteredFormat: { wrapStrategy: "WRAP", verticalAlignment: "TOP" } },
        fields: "userEnteredFormat.wrapStrategy,userEnteredFormat.verticalAlignment",
      },
    },
    ...t.widths.map((px, i) => ({ updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: i, endIndex: i + 1 }, properties: { pixelSize: px }, fields: "pixelSize" } })),
    {
      addProtectedRange: {
        protectedRange: {
          range: { sheetId },
          description: PROTECTION,
          warningOnly: true,
          unprotectedRanges: memoCol >= 0 ? [{ sheetId, startRowIndex: 2, startColumnIndex: memoCol, endColumnIndex: memoCol + 1 }] : [],
        },
      },
    },
  ];
  if (memoCol >= 0) {
    reqs.push({
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: memoCol, endColumnIndex: memoCol + 1 },
        cell: { userEnteredFormat: { backgroundColor: { red: 1, green: 0.97, blue: 0.85 } } },
        fields: "userEnteredFormat.backgroundColor",
      },
    });
  }
  if (statusCol >= 0) {
    STATUS_COLORS.forEach(([text, color], index) =>
      reqs.push({
        addConditionalFormatRule: {
          index,
          rule: {
            ranges: [{ sheetId, startRowIndex: 2, startColumnIndex: statusCol, endColumnIndex: statusCol + 1 }],
            booleanRule: { condition: { type: "TEXT_STARTS_WITH", values: [{ userEnteredValue: text }] }, format: { backgroundColor: color } },
          },
        },
      }),
    );
  }
  return reqs;
}
