/**
 * チームのスプレッドシート (WBS・タスク・スケジュール・カリキュラムなど) の各タブの中身を、
 * リポジトリの文書と教材の定義から作る。ここが唯一の正 (シートを直接直しても、次の更新で戻る)。
 *
 * - WBS: docs/development-progress.md のサマリ表と「### T-x-yy」の各タスク
 * - タスク・スケジュール: docs/implementation-plan.md の「これからの作業と予定」の表 + 完了したタスクの実績
 * - カリキュラム・課題: content/curriculum.ts (受講生に配信している教材と同じ定義)
 * - 意思決定: docs/development-progress.md の「確認が必要な事項」の表
 * - 更新履歴: git のコミット
 *
 * 推測で値を埋めない。日付が分からないものは「未定」・「—」のまま出す。
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { ASSIGNMENTS, COURSE, MODULES } from "../../content/curriculum";

export type Cell = string | number;
export type Tab = {
  name: string;
  /** 1 行目に出す説明 (自動更新であること・元の文書) */
  note: string;
  header: string[];
  rows: Cell[][];
  /** 列の幅 (ピクセル)。header と同じ数 */
  widths: number[];
  /** この列は利用者が自由に書ける (自動更新でも、1 列目の ID ごとに書いた内容を残す) */
  memoColumn?: string;
  /** 状態の列 (色分けする) */
  statusColumn?: string;
};

export const MEMO = "チームメモ (自由に記入)";
/** 自動更新では中身を変えないタブ (チームが自由に使う) */
export const TEAM_TAB = { name: "チーム入力", header: ["日付", "名前", "種類 (質問・提案・報告など)", "内容", "対応状況"] };

/** マークダウンの見出しの直後にある表を、ヘッダー行つきで読む */
export function tableAfter(md: string, heading: string): { header: string[]; rows: string[][] } {
  const lines = md.split("\n");
  const start = lines.findIndex((l) => /^#{1,6} /.test(l) && l.replace(/^#+\s*/, "").startsWith(heading));
  if (start < 0) throw new Error(`見出し「${heading}」が見つかりません`);
  const table: string[][] = [];
  for (let i = start + 1; i < lines.length; i++) {
    const l = lines[i].trim();
    if (/^#{1,6} /.test(l)) break;
    if (!l.startsWith("|")) {
      if (table.length) break;
      continue;
    }
    if (/^\|[\s|:-]+\|$/.test(l)) continue; // 区切り行
    table.push(splitRow(l));
  }
  if (table.length < 2) throw new Error(`見出し「${heading}」の後に表がありません`);
  return { header: table[0], rows: table.slice(1) };
}

function splitRow(line: string): string[] {
  return line.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => stripMarkdown(c.trim()));
}

/** リンク・コード・強調の記号を外して、表のセルに読みやすい文字だけを残す */
export function stripMarkdown(s: string): string {
  return s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/`([^`]+)`/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");
}

export type TaskEntry = { id: string; title: string; step: string; owner: string; status: string; result: string };

/** development-progress.md の「### T-x-yy タイトル」の節を読む */
export function taskEntries(md: string): TaskEntry[] {
  const out: TaskEntry[] = [];
  const re = /^### (T-(\d+)-(\d+)) (.+)$/gm;
  const heads = [...md.matchAll(re)];
  heads.forEach((m, i) => {
    const end = i + 1 < heads.length ? heads[i + 1].index : md.indexOf("\n## ", m.index + 1);
    const body = md.slice(m.index, end < 0 ? undefined : end);
    const field = (name: string) => stripMarkdown(body.match(new RegExp(`^\\* ${name}: (.+)$`, "m"))?.[1]?.trim() ?? "");
    // T-0-01〜03 は STEP 1〜3 (調査・整理・ロードマップ)。それ以外は T-<STEP>-<番号>
    const step = m[2] === "0" ? String(Number(m[3])) : m[2];
    out.push({ id: m[1], title: m[4].trim(), step, owner: field("担当"), status: field("ステータス"), result: field("テスト結果") });
  });
  return out;
}

export type Git = { firstAdded(text: string, file: string): string; log(n: number): { date: string; sha: string; subject: string }[]; head(): string };

/** git から実績の日付を取る。履歴がない (浅い clone) 場合は空を返し、推測しない */
export function gitReader(root: string): Git {
  const run = (args: string[]) => {
    try {
      return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    } catch {
      return "";
    }
  };
  return {
    firstAdded: (text, file) => run(["log", "--format=%ad", "--date=short", "-S", text, "--", file]).split("\n").filter(Boolean).at(-1) ?? "",
    log: (n) =>
      run(["log", `-n${n}`, "--format=%ad%x09%h%x09%s", "--date=short", "--", "its-academy", "docs", ".github"])
        .split("\n")
        .filter(Boolean)
        .map((l) => {
          const [date, sha, subject] = l.split("\t");
          return { date, sha, subject };
        }),
    head: () => run(["log", "-1", "--format=%h %ad", "--date=format:%Y-%m-%d %H:%M"]),
  };
}

const safeDecode = (url: string) => {
  try {
    return decodeURI(url); // 日本語の記事名を読めるようにする
  } catch {
    return url;
  }
};

const done = (status: string) => status.startsWith("完了");

export function buildTabs(root: string, git: Git = gitReader(root)): Tab[] {
  const progress = readFileSync(path.join(root, "docs/development-progress.md"), "utf8");
  const plan = readFileSync(path.join(root, "docs/implementation-plan.md"), "utf8");
  const steps = tableAfter(progress, "サマリ").rows; // STEP | 内容 | ステータス
  const tasks = taskEntries(progress);
  const decisions = tableAfter(progress, "確認が必要な事項").rows; // ID | 内容 | 仮定
  const upcoming = tableAfter(plan, "4. これからの作業と予定").rows; // ID | 作業 | 区分 | 担当 | 状態 | 開始予定 | 期限 | 前提
  const doneDate = new Map(tasks.map((t) => [t.id, git.firstAdded(`### ${t.id} `, "docs/development-progress.md") || "—"]));
  const head = git.head();
  const auto = (src: string) => `自動更新 (${head || "日時不明"} 時点)。元: ${src}。この表を直接直しても次の更新で戻ります。「${MEMO}」の列だけは残ります。`;

  // ---- WBS
  const wbsRows: Cell[][] = [];
  for (const [no, name, status] of steps) {
    const stepNo = no.split(/[〜~]/)[0];
    wbsRows.push([`${no}`, 1, `STEP ${no} ${name}`, status.split(" (")[0], "", "", status, ""]);
    tasks
      .filter((t) => t.step === stepNo)
      .forEach((t) => wbsRows.push([t.id, 2, `　${t.title}`, t.status, t.owner, doneDate.get(t.id) ?? "—", t.result, ""]));
  }

  // ---- タスク (これからの作業)
  const taskRows: Cell[][] = upcoming.map(([id, work, kind, owner, status, start, due, dep]) => [id, work, kind, owner, status, start, due, dep, ""]);
  // STEP ごとの「次の作業」(実装計画の表) も参照できるようにする
  const stepNext = tableAfter(plan, "2. STEP ごとの計画と状態").rows.filter((r) => r[3] && r[3] !== "—");

  // ---- スケジュール: 予定 (未完了) と実績 (完了したタスクの日付)
  const scheduleRows: Cell[][] = [
    ...upcoming.map(([id, work, , owner, status, start, due]) => ["予定", id, work, owner, status, start, due]),
    // 実績の日付は、進捗の文書にそのタスクを記録した日 (git の履歴)。作業を始めた日は記録がないため出さない
    ...tasks.map((t) => ["実績", t.id, t.title, t.owner, t.status, "—", doneDate.get(t.id) ?? "—"]),
  ];

  // ---- カリキュラム
  const afterLesson = new Map<string, string[]>();
  for (const a of ASSIGNMENTS) afterLesson.set(a.afterLesson, [...(afterLesson.get(a.afterLesson) ?? []), a.slug]);
  const curriculumRows: Cell[][] = [];
  let order = 0;
  for (const m of MODULES) {
    for (const l of m.lessons) {
      order += 1;
      curriculumRows.push([
        l.slug,
        order,
        m.level,
        m.optional ? "選択" : "必修",
        m.title,
        l.title,
        l.estimatedMinutes,
        l.content.quiz.questions.length,
        l.content.code.length,
        (afterLesson.get(l.slug) ?? []).join(", ") || "—",
        l.sourceUrl ? safeDecode(l.sourceUrl) : "—",
        "",
      ]);
    }
  }

  const assignmentRows: Cell[][] = ASSIGNMENTS.map((a) => [a.slug, a.level, a.title, a.type, a.passScore, a.afterLesson, a.body.requirements.length, ""]);
  const decisionRows: Cell[][] = decisions.map(([id, what, assumption]) => [id, what, assumption, "回答待ち (仮定で進行中)", ""]);
  const historyRows: Cell[][] = git.log(80).map((c) => [c.date, c.subject.split(":")[0], c.subject.replace(/^[^:]+:\s*/, ""), c.sha]);

  // ---- 概要
  const required = MODULES.filter((m) => !m.optional);
  const lessonsOf = (ms: typeof MODULES) => ms.flatMap((m) => m.lessons);
  const hours = (ms: typeof MODULES) => Math.round(lessonsOf(ms).reduce((s, l) => s + l.estimatedMinutes, 0) / 6) / 10;
  const count = <T,>(xs: T[], f: (x: T) => boolean) => xs.filter(f).length;
  const summaryRows: Cell[][] = [
    ["プロジェクト", "ITS ENGINEER ACADEMY (LMS とカリキュラム)"],
    ["コース", `${COURSE.title} (${COURSE.weeks} 週間)`],
    ["データの時点", head || "—"],
    ["STEP", `${steps.length} 件中 完了 ${count(steps, (r) => done(r[2]))} 件 / 進行中 ${count(steps, (r) => r[2].startsWith("進行中"))} 件`],
    ["完了したタスク (WBS)", `${count(tasks, (t) => done(t.status))} / ${tasks.length} 件`],
    ["これからの作業", `${upcoming.length} 件 (回答待ち ${count(upcoming, (r) => r[4] === "回答待ち")} 件・未着手 ${count(upcoming, (r) => r[4] === "未着手")} 件・進行中 ${count(upcoming, (r) => r[4] === "進行中")} 件)`],
    ["依頼者の判断待ち", `${decisions.length} 件 (意思決定タブ)`],
    ["教材 (必修)", `${lessonsOf(required).length} レッスン・目安 ${hours(required)} 時間`],
    ["教材 (選択)", `${lessonsOf(MODULES).length - lessonsOf(required).length} レッスン・目安 ${hours(MODULES.filter((m) => m.optional))} 時間`],
    ["課題", `${ASSIGNMENTS.length} 件`],
    ["実行して確認したサンプルコード", `${lessonsOf(MODULES).reduce((s, l) => s + l.content.code.length, 0)} 件`],
    ["テストの状況", steps.find((r) => r[0] === "12")?.[2] ?? "—"],
    ["", ""],
    ["このシートの使い方", "「チーム入力」タブと、各タブの「チームメモ」列は自由に書けます (自動更新でも消えません)。"],
    ["", "ほかの列は自動更新です。進捗や予定を変えるときは、リポジトリの文書 (下記) を更新してください。数分でここに反映されます。"],
    ["元の文書", "docs/development-progress.md (WBS・意思決定) / docs/implementation-plan.md (タスク・予定) / its-academy/content (カリキュラム)"],
  ];

  return [
    { name: "概要", note: auto("リポジトリの文書と教材の定義"), header: ["項目", "内容"], rows: summaryRows, widths: [220, 760] },
    { name: "WBS", note: auto("docs/development-progress.md"), header: ["WBS 番号", "階層", "作業", "状態", "担当", "記録日", "内容・確認結果", MEMO], rows: wbsRows, widths: [90, 50, 360, 110, 200, 100, 520, 240], memoColumn: MEMO, statusColumn: "状態" },
    { name: "タスク", note: auto("docs/implementation-plan.md「これからの作業と予定」"), header: ["ID", "作業", "区分", "担当", "状態", "開始予定", "期限", "前提", MEMO], rows: taskRows, widths: [60, 420, 70, 140, 120, 100, 100, 120, 240], memoColumn: MEMO, statusColumn: "状態" },
    { name: "STEP 別の次の作業", note: auto("docs/implementation-plan.md「STEP ごとの計画と状態」"), header: ["STEP", "内容", "状態", "次の作業", MEMO], rows: stepNext.map((r) => [...r.slice(0, 4), ""]), widths: [70, 220, 240, 520, 240], memoColumn: MEMO },
    { name: "スケジュール", note: auto("予定: docs/implementation-plan.md / 実績: git の履歴 (文書にタスクを記録した日)"), header: ["区分", "ID", "作業", "担当", "状態", "開始 (予定)", "期限 (予定) / 記録日 (実績)"], rows: scheduleRows, widths: [60, 80, 420, 200, 120, 100, 170], statusColumn: "状態" },
    { name: "カリキュラム", note: auto("its-academy/content/curriculum.ts (受講生に配信している教材の定義)"), header: ["レッスン ID", "順番", "レベル", "必修・選択", "モジュール", "レッスン", "目安 (分)", "理解度チェック (問)", "サンプルコード (件)", "この後に取り組む課題", "元の記事", MEMO], rows: curriculumRows, widths: [200, 50, 60, 80, 200, 320, 70, 90, 90, 200, 260, 240], memoColumn: MEMO },
    { name: "課題", note: auto("its-academy/content/curriculum.ts"), header: ["課題 ID", "レベル", "課題", "形式", "合格点", "前提のレッスン", "必須要件 (件)", MEMO], rows: assignmentRows, widths: [200, 60, 360, 120, 70, 200, 90, 240], memoColumn: MEMO },
    { name: "意思決定", note: auto("docs/development-progress.md「確認が必要な事項」"), header: ["ID", "確認したいこと", "回答があるまでの仮定", "状態", MEMO], rows: decisionRows, widths: [60, 420, 520, 160, 240], memoColumn: MEMO, statusColumn: "状態" },
    { name: "更新履歴", note: auto("git のコミット (新しい順・最大 80 件)"), header: ["日付", "種類", "内容", "コミット"], rows: historyRows, widths: [100, 160, 640, 90] },
  ];
}
