/** @OnlyCurrentDoc */
/**
 * ITS ENGINEER ACADEMY プロジェクト管理シート — 自動更新のスクリプト (Google Apps Script)
 *
 * 使い方 (1 回だけ。docs/project-sheet.md):
 *   1. スプレッドシートの「拡張機能」→「Apps Script」を開き、最初からあるコードを消して、このファイルの中身をすべて貼り付けて保存する
 *   2. 上の関数の選択で「setup」を選んで「実行」→ 許可を求められたら、自分のアカウントを選んで「許可」
 *   3. シートに戻ると、タブができている。以後は 1 時間ごとに自動で更新される (メニューの「プロジェクト管理」→「今すぐ更新」でも更新できる)
 *
 * しくみ: GitHub Actions がリポジトリの文書から作ったデータ (公開の JSON) を読み込んで、各タブを書き直す。
 * 「チーム入力」タブと、各タブの「チームメモ」列は書き換えない (1 列目の ID ごとに残す)。
 * このスクリプトがアクセスするのは、このスプレッドシートと下の URL だけ。パスワードや鍵は使わない。
 */
var DATA_URL = "https://raw.githubusercontent.com/ktakahashi7755-creator/Hoku-Tech/project-sheet-data/claude__sharp-bohr-4wbemd.json";
var PROTECTION = "自動更新のタブ (変更はリポジトリの文書で行う)";
var DEFAULT_TABS = ["Sheet1", "シート1"];
var STATUS_COLORS = [["完了", "#d9f0db"], ["進行中", "#dbe8fd"], ["回答待ち", "#fff2cc"], ["保留", "#fff2cc"], ["ブロック", "#fcdede"]];

/** 最初に 1 回だけ実行する: 1 時間ごとの自動更新を登録して、すぐに 1 回更新する */
function setup() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "syncProjectSheet") ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("syncProjectSheet").timeBased().everyHours(1).create();
  syncProjectSheet();
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu("プロジェクト管理").addItem("今すぐ更新", "syncProjectSheet").addToUi();
}

function syncProjectSheet() {
  var res = UrlFetchApp.fetch(DATA_URL, { muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) throw new Error("データを取得できませんでした (HTTP " + res.getResponseCode() + ")。しばらくしてから「今すぐ更新」を押してください");
  var data = JSON.parse(res.getContentText());
  if (data.version !== 1 || !data.tabs) throw new Error("データの形式が想定と違います。スクリプトを最新のものに貼り替えてください");
  applyProjectData(SpreadsheetApp.getActiveSpreadsheet(), data);
}

/** データをスプレッドシートに反映する (テストから呼べるよう、取得とは分ける) */
function applyProjectData(ss, data) {
  var lock = LockService.getDocumentLock();
  lock.waitLock(30000); // 自動更新と手動の更新が重ならないように
  try {
    data.tabs.forEach(function (t) {
      writeTab(ss.getSheetByName(t.name) || ss.insertSheet(t.name), t);
    });
    var team = ss.getSheetByName(data.teamTab.name);
    if (!team) {
      team = ss.insertSheet(data.teamTab.name);
      team.getRange(1, 1, 1, data.teamTab.header.length).setValues([data.teamTab.header]).setFontWeight("bold").setBackground("#e6ebf5");
      team.setFrozenRows(1);
    }
    // 最初からある空のタブは消す
    DEFAULT_TABS.forEach(function (name) {
      var s = ss.getSheetByName(name);
      if (s && s.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(s);
    });
    // タブの並びを揃える (チーム入力は最後)
    data.tabs.map(function (t) { return t.name; }).concat([data.teamTab.name]).forEach(function (name, i) {
      var s = ss.getSheetByName(name);
      ss.setActiveSheet(s);
      ss.moveActiveSheet(i + 1);
    });
    ss.setActiveSheet(ss.getSheetByName(data.tabs[0].name));
  } finally {
    lock.releaseLock();
  }
}

function writeTab(sheet, t) {
  var width = t.header.length;
  var memoCol = t.memoColumn ? t.header.indexOf(t.memoColumn) : -1;
  var memos = memoCol >= 0 ? readMemos(sheet, t.memoColumn) : {};
  var values = tableValues(t, memos, memoCol);

  // 先に上書きしてから、表の外 (下と右) に残った古い値だけを消す (途中で失敗してもチームメモを失わない)
  var range = sheet.getRange(1, 1, values.length, width);
  range.setNumberFormat("@"); // 文字のまま入れる (日付や数値に変えない)
  range.setValues(values);
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow > values.length) sheet.getRange(values.length + 1, 1, lastRow - values.length, Math.max(lastCol, width)).clearContent();
  if (lastCol > width) sheet.getRange(1, width + 1, Math.max(lastRow, values.length), lastCol - width).clearContent();

  // 見た目
  sheet.setFrozenRows(2);
  sheet.getRange(1, 1).setFontStyle("italic").setFontColor("#666666");
  sheet.getRange(2, 1, 1, width).setFontWeight("bold").setBackground("#e6ebf5").setWrap(true).setVerticalAlignment("middle");
  if (values.length > 2) sheet.getRange(3, 1, values.length - 2, width).setWrap(true).setVerticalAlignment("top");
  t.widths.forEach(function (px, i) { sheet.setColumnWidth(i + 1, px); });
  if (memoCol >= 0) sheet.getRange(2, memoCol + 1).setBackground("#fff8d9");

  // 状態の色分け (毎回入れ替えるので増えない)
  var statusCol = t.statusColumn ? t.header.indexOf(t.statusColumn) : -1;
  var rules = [];
  if (statusCol >= 0) {
    var statusRange = sheet.getRange(3, statusCol + 1, Math.max(values.length - 2, 1), 1);
    STATUS_COLORS.forEach(function (c) {
      rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextStartsWith(c[0]).setBackground(c[1]).setRanges([statusRange]).build());
    });
  }
  sheet.setConditionalFormatRules(rules);

  // 編集すると警告が出る保護 (チームメモの列は除く)。前回このスクリプトが付けた保護だけを付け直す
  // 人が付けた保護があるタブには付けない (その保護を書き換えないように)
  var others = 0;
  sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(function (p) {
    if (p.getDescription() === PROTECTION) p.remove();
    else others++;
  });
  if (others > 0) return;
  var protection = sheet.protect().setDescription(PROTECTION).setWarningOnly(true);
  if (memoCol >= 0) protection.setUnprotectedRanges([sheet.getRange(3, memoCol + 1, sheet.getMaxRows() - 2, 1)]);
}

/** 今のシートから ID → チームメモ を読む (1 行目は説明、2 行目は見出し) */
function readMemos(sheet, memoColumn) {
  var out = {};
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 1) return out;
  var values = sheet.getRange(1, 1, lastRow, lastCol).getDisplayValues();
  var headerRow = -1;
  for (var r = 0; r < values.length; r++) if (values[r].indexOf(memoColumn) >= 0) { headerRow = r; break; }
  if (headerRow < 0) return out;
  var col = values[headerRow].indexOf(memoColumn);
  for (var i = headerRow + 1; i < values.length; i++) {
    var id = String(values[i][0] || "").trim();
    var memo = String(values[i][col] || "").trim();
    if (id && memo) out[id] = memo;
  }
  return out;
}

/** 1 行目に説明、2 行目に見出し、3 行目から中身。チームメモを戻し、行がなくなった項目のメモは表の下に残す */
function tableValues(t, memos, memoCol) {
  var width = t.header.length;
  var pad = function (row) {
    var r = row.map(function (c) { return c === null || c === undefined ? "" : String(c); });
    while (r.length < width) r.push("");
    return r;
  };
  var ids = {};
  var rows = t.rows.map(function (row) {
    ids[String(row[0])] = true;
    var r = pad(row);
    if (memoCol >= 0 && memos[String(row[0])]) r[memoCol] = memos[String(row[0])];
    return r;
  });
  var values = [pad([t.note]), pad(t.header)].concat(rows);
  if (memoCol >= 0) {
    var orphans = Object.keys(memos).filter(function (id) { return !ids[id] && id !== "(行がなくなった項目のメモ)"; });
    if (orphans.length) {
      values.push(pad([]));
      values.push(pad(["(行がなくなった項目のメモ)"]));
      orphans.forEach(function (id) {
        var r = pad([id]);
        r[memoCol] = memos[id];
        values.push(r);
      });
    }
  }
  return values;
}
