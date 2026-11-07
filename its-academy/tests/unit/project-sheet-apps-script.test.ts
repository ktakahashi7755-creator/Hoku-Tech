import { readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";
import { buildTabs, TEAM_TAB } from "../../scripts/project-sheet/build";

/**
 * スプレッドシートに貼る Apps Script (scripts/project-sheet/apps-script.gs) を、Google のシートを模した
 * 小さな部品の上で動かして確かめる (Apps Script の実行環境はここにはないため)。
 */
type Grid = string[][];
class FakeSheet {
  grid: Grid = [];
  frozen = 0;
  widths: Record<number, number> = {};
  rules: unknown[] = [];
  protections: { description: string; removed: boolean; warningOnly?: boolean; unprotected?: unknown[] }[] = [];
  constructor(public name: string) {}
  getLastRow() {
    for (let r = this.grid.length - 1; r >= 0; r--) if (this.grid[r]?.some((c) => c !== "")) return r + 1;
    return 0;
  }
  getLastColumn() {
    let max = 0;
    this.grid.forEach((row) => row?.forEach((c, i) => c !== "" && (max = Math.max(max, i + 1))));
    return max;
  }
  getMaxRows() {
    return 1000;
  }
  getRange(r: number, c: number, nr = 1, nc = 1) {
    if (nr < 1 || nc < 1) throw new Error(`範囲が空です (${nr}x${nc})`);
    const set = (row: number, col: number, v: string) => this.set(row, col, v);
    const grid = () => this.grid;
    const range: Record<string, (...a: unknown[]) => unknown> = {
      setValues(values: unknown) {
        const v = values as string[][];
        if (v.length !== nr || v.some((row) => row.length !== nc)) throw new Error("値の大きさが範囲と違います");
        v.forEach((row, i) => row.forEach((val, j) => set(r + i, c + j, val)));
        return range;
      },
      clearContent() {
        for (let i = 0; i < nr; i++) for (let j = 0; j < nc; j++) set(r + i, c + j, "");
        return range;
      },
      getDisplayValues() {
        return Array.from({ length: nr }, (_, i) => Array.from({ length: nc }, (_, j) => grid()[r - 1 + i]?.[c - 1 + j] ?? ""));
      },
    };
    for (const m of ["setNumberFormat", "setFontStyle", "setFontColor", "setFontWeight", "setBackground", "setWrap", "setVerticalAlignment"]) range[m] = () => range;
    return range;
  }
  set(r: number, c: number, v: string) {
    while (this.grid.length < r) this.grid.push([]);
    const row = this.grid[r - 1];
    while (row.length < c) row.push("");
    row[c - 1] = v;
  }
  setFrozenRows(n: number) {
    this.frozen = n;
  }
  setColumnWidth(i: number, px: number) {
    this.widths[i] = px;
  }
  setConditionalFormatRules(rules: unknown[]) {
    this.rules = rules;
  }
  getProtections() {
    return this.protections.filter((p) => !p.removed).map((p) => ({ getDescription: () => p.description, remove: () => (p.removed = true) }));
  }
  protect() {
    const p = { description: "", removed: false } as FakeSheet["protections"][number];
    this.protections.push(p);
    const api = {
      setDescription: (d: string) => ((p.description = d), api),
      setWarningOnly: (w: boolean) => ((p.warningOnly = w), api),
      setUnprotectedRanges: (r: unknown[]) => ((p.unprotected = r), api),
    };
    return api;
  }
}

function fakeSpreadsheet() {
  const sheets: FakeSheet[] = [new FakeSheet("シート1")];
  let active: FakeSheet = sheets[0];
  return {
    sheets,
    getSheetByName: (n: string) => sheets.find((s) => s.name === n) ?? null,
    insertSheet: (n: string) => {
      const s = new FakeSheet(n);
      sheets.push(s);
      return s;
    },
    getSheets: () => sheets,
    deleteSheet: (s: FakeSheet) => sheets.splice(sheets.indexOf(s), 1),
    setActiveSheet: (s: FakeSheet) => (active = s),
    moveActiveSheet: (pos: number) => {
      sheets.splice(sheets.indexOf(active), 1);
      sheets.splice(pos - 1, 0, active);
    },
  };
}

function load(fetchBody?: string) {
  const ruleBuilder = () => {
    const b = { whenTextStartsWith: () => b, setBackground: () => b, setRanges: () => b, build: () => ({ rule: true }) };
    return b;
  };
  const triggers: { fn: string }[] = [];
  const ctx = vm.createContext({
    SpreadsheetApp: { newConditionalFormatRule: ruleBuilder, ProtectionType: { SHEET: "SHEET" } },
    LockService: { getDocumentLock: () => ({ waitLock: () => {}, releaseLock: () => {} }) },
    UrlFetchApp: { fetch: () => ({ getResponseCode: () => (fetchBody ? 200 : 404), getContentText: () => fetchBody ?? "" }) },
    ScriptApp: {
      getProjectTriggers: () => triggers.map((t) => ({ getHandlerFunction: () => t.fn })),
      deleteTrigger: () => triggers.pop(),
      newTrigger: (fn: string) => ({ timeBased: () => ({ everyHours: () => ({ create: () => triggers.push({ fn }) }) }) }),
    },
  });
  vm.runInContext(readFileSync(path.resolve(__dirname, "../../scripts/project-sheet/apps-script.gs"), "utf8"), ctx);
  return { ctx: ctx as unknown as Record<string, (...a: unknown[]) => unknown> & { DATA_URL: string }, triggers };
}

const MEMO = "チームメモ (自由に記入)";
const data = (rows: (string | number)[][]) => ({
  version: 1,
  teamTab: { name: "チーム入力", header: ["日付", "名前", "内容"] },
  tabs: [
    { name: "概要", note: "自動更新", header: ["項目", "内容"], rows: [["コース", "Java"]], widths: [100, 200] },
    { name: "タスク", note: "自動更新", header: ["ID", "作業", "状態", MEMO], rows, widths: [60, 200, 100, 200], memoColumn: MEMO, statusColumn: "状態" },
  ],
});

describe("スプレッドシートに貼る Apps Script", () => {
  it("タブを作って中身を書き、空の最初のタブを消し、並びを揃える", () => {
    const ss = fakeSpreadsheet();
    const { ctx } = load();
    ctx.applyProjectData(ss, data([["P-01", "レビュー", "未着手", ""], ["P-02", "2026-11-07", "完了", ""]]));
    expect(ss.sheets.map((s) => s.name)).toEqual(["概要", "タスク", "チーム入力"]);
    const task = ss.getSheetByName("タスク")!;
    expect(task.grid.slice(0, 4)).toEqual([["自動更新", "", "", ""], ["ID", "作業", "状態", MEMO], ["P-01", "レビュー", "未着手", ""], ["P-02", "2026-11-07", "完了", ""]]);
    expect(task.frozen).toBe(2);
    expect(task.rules).toHaveLength(5);
    expect(task.protections.filter((p) => !p.removed)).toHaveLength(1);
    expect(ss.getSheetByName("チーム入力")!.grid[0]).toEqual(["日付", "名前", "内容"]);
  });

  it("2 回目以降: チームメモと人の入力を残し、減った行の古い値を消し、色分けと保護を増やさない", () => {
    const ss = fakeSpreadsheet();
    const { ctx } = load();
    ctx.applyProjectData(ss, data([["P-01", "レビュー", "未着手", ""], ["P-02", "確認", "完了", ""], ["P-03", "古い", "完了", ""]]));
    const task = ss.getSheetByName("タスク")!;
    task.set(3, 4, "来週相談"); // P-01 のメモ
    task.set(5, 4, "P-03 のメモ");
    ss.getSheetByName("チーム入力")!.set(2, 3, "質問があります");
    ctx.applyProjectData(ss, data([["P-02", "確認", "完了", ""], ["P-01", "レビュー", "進行中", ""]]));
    expect(task.grid.slice(2, 4)).toEqual([["P-02", "確認", "完了", ""], ["P-01", "レビュー", "進行中", "来週相談"]]);
    // P-03 の行はなくなったが、メモは表の下に残る
    expect(task.grid.slice(4, 7)).toEqual([["", "", "", ""], ["(行がなくなった項目のメモ)", "", "", ""], ["P-03", "", "", "P-03 のメモ"]]);
    expect(task.getLastRow()).toBe(7);
    expect(task.rules).toHaveLength(5);
    expect(task.protections.filter((p) => !p.removed)).toHaveLength(1);
    expect(ss.getSheetByName("チーム入力")!.grid[1][2]).toBe("質問があります");
    // 3 回目でも、残したメモは同じ位置に 1 つだけ
    ctx.applyProjectData(ss, data([["P-02", "確認", "完了", ""], ["P-01", "レビュー", "進行中", ""]]));
    expect(task.grid.filter((r) => r[0] === "P-03")).toHaveLength(1);
  });

  it("人が付けた保護は書き換えない", () => {
    const ss = fakeSpreadsheet();
    const { ctx } = load();
    ctx.applyProjectData(ss, data([["P-01", "a", "完了", ""]]));
    const task = ss.getSheetByName("タスク")!;
    task.protections.push({ description: "管理者だけ", removed: false });
    ctx.applyProjectData(ss, data([["P-01", "a", "完了", ""]]));
    expect(task.protections.filter((p) => !p.removed).map((p) => p.description)).toEqual(["管理者だけ"]);
  });

  it("setup は自動更新を 1 つだけ登録する。データを取れないときは分かる言葉で止まる", () => {
    const { ctx, triggers } = load();
    expect(() => ctx.setup()).toThrow(/データを取得できませんでした \(HTTP 404\)/);
    expect(() => ctx.setup()).toThrow();
    expect(triggers).toEqual([{ fn: "syncProjectSheet" }]);
    expect(ctx.DATA_URL).toBe("https://raw.githubusercontent.com/ktakahashi7755-creator/Hoku-Tech/project-sheet-data/claude__sharp-bohr-4wbemd.json");
  });

  it("実際に公開するデータの形を読み込める", () => {
    const { ctx } = load();
    const ss = fakeSpreadsheet();
    const noGit = { firstAdded: () => "", log: () => [], head: () => "" };
    const sample = JSON.parse(JSON.stringify({ version: 1, teamTab: TEAM_TAB, tabs: buildTabs(path.resolve(__dirname, "../../.."), noGit) }));
    ctx.applyProjectData(ss, sample);
    expect(ss.sheets.map((s) => s.name).at(-1)).toBe("チーム入力");
    expect(ss.getSheetByName("カリキュラム")!.getLastRow()).toBeGreaterThan(30);
  });
});
