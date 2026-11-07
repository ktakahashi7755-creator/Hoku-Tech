import { createVerify, generateKeyPairSync } from "node:crypto";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildTabs, MEMO, stripMarkdown, tableAfter, taskEntries, TEAM_TAB, type Tab } from "../../scripts/project-sheet/build";
import { accessToken, readMemos, syncSpreadsheet, tableValues } from "../../scripts/project-sheet/sheets";

const ROOT = path.resolve(__dirname, "../../..");

describe("スプレッドシートの中身 (リポジトリの文書から作る)", () => {
  it("見出しの後の表とタスクの節を読む", () => {
    const md = "## サマリ\n\n| STEP | 内容 | ステータス |\n|---|---|---|\n| 1 | [調査](a.md) | 完了 |\n\n### T-0-01 調べる\n\n* 担当: Claude Code\n* ステータス: 完了\n* テスト結果: `0` 件\n\n### T-5-02 作る\n\n* ステータス: 進行中\n\n## 次\n";
    expect(tableAfter(md, "サマリ")).toEqual({ header: ["STEP", "内容", "ステータス"], rows: [["1", "調査", "完了"]] });
    expect(taskEntries(md)).toEqual([
      { id: "T-0-01", title: "調べる", step: "1", owner: "Claude Code", status: "完了", result: "0 件" },
      { id: "T-5-02", title: "作る", step: "5", owner: "", status: "進行中", result: "" },
    ]);
    expect(stripMarkdown("**太字** と [リンク](x)")).toBe("太字 と リンク");
  });

  it("実際の文書と教材から全タブを作れる (日付は git から取り、分からなければ — のまま)", () => {
    const noGit = { firstAdded: () => "", log: () => [], head: () => "" };
    const tabs = buildTabs(ROOT, noGit);
    expect(tabs.map((t) => t.name)).toEqual(["概要", "WBS", "タスク", "STEP 別の次の作業", "スケジュール", "カリキュラム", "課題", "意思決定", "更新履歴"]);
    for (const t of tabs) for (const r of t.rows) expect(r.length).toBe(t.header.length);
    const wbs = tabs.find((t) => t.name === "WBS")!;
    expect(wbs.rows.filter((r) => r[1] === 1)).toHaveLength(13); // STEP 1〜13
    expect(wbs.rows.filter((r) => r[1] === 2).every((r) => r[5] === "—")).toBe(true);
    expect(tabs.find((t) => t.name === "カリキュラム")!.rows).toHaveLength(35);
    expect(tabs.find((t) => t.name === "タスク")!.rows.some((r) => r[0] === "P-03" && r[6] === "未定")).toBe(true);
  });
});

describe("Google スプレッドシートへの反映", () => {
  const tab: Tab = { name: "タスク", note: "自動更新", header: ["ID", "作業", "状態", MEMO], rows: [["P-01", "レビュー", "未着手", ""], ["P-02", "確認", "完了", ""]], widths: [60, 200, 100, 200], memoColumn: MEMO, statusColumn: "状態" };

  it("チームメモは ID ごとに残し、行がなくなった項目のメモも捨てない", () => {
    const memos = readMemos([["自動更新"], ["ID", "作業", "状態", MEMO], ["P-01", "", "", "来週相談"], ["P-09", "", "", "古い行のメモ"]], MEMO);
    const values = tableValues(tab, memos);
    expect(values[2]).toEqual(["P-01", "レビュー", "未着手", "来週相談"]);
    expect(values[3]).toEqual(["P-02", "確認", "完了", ""]);
    expect(values.at(-1)).toEqual(["P-09", "", "", "古い行のメモ"]);
  });

  it("サービスアカウントの鍵で署名したトークンを使い、タブの作成・書き込み・書式を行う (繰り返しても色分けと保護が増えない)", async () => {
    const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
    const sa = { client_email: "sheet-sync@example.iam.gserviceaccount.com", private_key: privateKey.export({ type: "pkcs8", format: "pem" }).toString() };
    const calls: { method: string; url: string; body?: unknown }[] = [];
    const sheets = [{ properties: { sheetId: 0, title: "シート1" } }, { properties: { sheetId: 7, title: "タスク" }, conditionalFormats: [{}, {}], protectedRanges: [{ protectedRangeId: 3, description: "自動更新のタブ (変更はリポジトリの文書で行う)" }, { protectedRangeId: 4, description: "人が付けた保護" }] }];
    const fake = (async (url: string, init?: RequestInit) => {
      const method = init?.method ?? "GET";
      const body = typeof init?.body === "string" ? JSON.parse(init.body) : init?.body;
      calls.push({ method, url: decodeURIComponent(url), body });
      const json = (v: unknown) => new Response(JSON.stringify(v), { status: 200 });
      if (url.startsWith("https://oauth2.googleapis.com/token")) {
        const assertion = (body as URLSearchParams).get("assertion")!;
        const [h, p, s] = assertion.split(".");
        expect(createVerify("RSA-SHA256").update(`${h}.${p}`).verify(publicKey, Buffer.from(s, "base64url"))).toBe(true);
        expect(JSON.parse(Buffer.from(p, "base64url").toString())).toMatchObject({ iss: sa.client_email, scope: "https://www.googleapis.com/auth/spreadsheets" });
        return json({ access_token: "token-1" });
      }
      expect((init?.headers as Record<string, string>).authorization).toBe("Bearer token-1");
      if (method === "GET" && url.includes("values:batchGet") && decodeURIComponent(url).includes("シート1")) return json({ valueRanges: [{}] });
      if (method === "GET" && url.includes("values:batchGet")) return json({ valueRanges: [{ values: [["説明"], tab.header, ["P-02", "", "", "担当を決める"]] }] });
      if (method === "GET") return json({ sheets: calls.some((c) => c.body && JSON.stringify(c.body).includes("addSheet")) ? [...sheets, { properties: { sheetId: 9, title: TEAM_TAB.name } }] : sheets });
      return json({});
    }) as typeof fetch;

    const token = await accessToken(sa, fake);
    await syncSpreadsheet("sheet-id", [tab], token, fake);

    const posts = calls.filter((c) => c.method !== "GET" && !c.url.includes("oauth2"));
    expect(posts[0].body).toEqual({ requests: [{ addSheet: { properties: { title: TEAM_TAB.name } } }] });
    expect(posts.find((c) => JSON.stringify(c.body).includes("deleteSheet"))?.body).toEqual({ requests: [{ deleteSheet: { sheetId: 0 } }] }); // 最初からある空のタブは消す
    expect(posts.find((c) => c.method === "PUT")?.body).toEqual({ values: [TEAM_TAB.header] }); // チーム入力は見出しだけ
    const written = posts.find((c) => c.url.endsWith("values:batchUpdate"))!.body as { valueInputOption: string; data: { values: string[][] }[] };
    expect(written.valueInputOption).toBe("RAW"); // 文字が日付や数値に変わらないように
    expect(written.data[0].values[3]).toEqual(["P-02", "確認", "完了", "担当を決める"]);
    const format = (posts.at(-1)!.body as { requests: Record<string, unknown>[] }).requests;
    expect(format.filter((r) => r.deleteConditionalFormatRule)).toHaveLength(2);
    expect(format.filter((r) => r.deleteProtectedRange)).toEqual([{ deleteProtectedRange: { protectedRangeId: 3 } }]); // 人が付けた保護は残す
    expect(format.filter((r) => r.addConditionalFormatRule)).toHaveLength(5);
    expect(calls.some((c) => c.url.includes("チーム入力") && c.url.includes("batchClear"))).toBe(false);
  });

  it("共有されていないなど、API が拒否したときは原因の候補を示す (トークンは出さない)", async () => {
    const fake = (async () => new Response("{}", { status: 403 })) as unknown as typeof fetch;
    await expect(syncSpreadsheet("x", [tab], "secret-token", fake)).rejects.toThrow(/編集者.*共有/);
    await expect(syncSpreadsheet("x", [tab], "secret-token", fake)).rejects.not.toThrow(/secret-token/);
  });
});
