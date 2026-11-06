/**
 * 教材のサンプルコードを実際に実行し、掲載している実行結果と一致するか検査する。
 * 使い方: npm run verify:code   (失敗時は exit 1)
 */
import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { cpSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { allLessons, buildLessonContent, ROOT } from "./curriculum-loader";

/** 検証用の DB 接続文字列から、使い捨てスキーマを指す JDBC の接続情報を作る */
function withScratchSchema<T>(fn: (jdbc: { url: string; user: string; password: string }) => T): T {
  const raw = process.env.VERIFY_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!raw) throw new Error("DB を使う検証には VERIFY_DATABASE_URL か DATABASE_URL が必要です");
  const u = new URL(raw);
  const schema = `verify_${randomBytes(6).toString("hex")}`;
  const psql = (...args: string[]) => execFileSync("psql", [raw, "-X", "-q", ...args], { stdio: ["ignore", "pipe", "pipe"] });
  psql("-c", `CREATE SCHEMA ${schema}`);
  try {
    return fn({
      url: `jdbc:postgresql://${u.hostname}:${u.port || 5432}${u.pathname}?currentSchema=${schema}`,
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
    });
  } finally {
    psql("-c", "SET client_min_messages = warning", "-c", `DROP SCHEMA ${schema} CASCADE`);
  }
}

/** Maven プロジェクトなどを runner スクリプトで実行する (DB は使い捨てスキーマ) */
function runProject(runner: string): string {
  const abs = path.join(ROOT, runner);
  const work = mkdtempSync(path.join(tmpdir(), "its-verify-"));
  try {
    cpSync(path.dirname(abs), work, { recursive: true, filter: (src) => !src.includes(`${path.sep}target`) });
    return withScratchSchema((db) => {
      const out = execFileSync("bash", ["-c", 'bash "$0" 2>&1', path.basename(abs)], {
        cwd: work,
        // Maven の依存取得にプロキシ設定が必要な環境があるため、JAVA_TOOL_OPTIONS は引き継ぎ、その通知行だけ除く
        env: { ...process.env, LANG: "C.UTF-8", DB_URL: db.url, DB_USER: db.user, DB_PASSWORD: db.password },
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        timeout: 10 * 60 * 1000,
      });
      return out
        .split("\n")
        .filter((l) => !l.startsWith("Picked up JAVA_TOOL_OPTIONS"))
        .join("\n");
    });
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

function run(language: string, file: string): string {
  const abs = path.join(ROOT, file);
  const work = mkdtempSync(path.join(tmpdir(), "its-verify-"));
  try {
    const env = { ...process.env, JAVA_TOOL_OPTIONS: "", LANG: "C.UTF-8", GIT_CONFIG_GLOBAL: "/dev/null" };
    if (language === "java") {
      cpSync(path.dirname(abs), work, { recursive: true });
      return execFileSync("java", ["-Dstdout.encoding=UTF-8", path.basename(abs)], { cwd: work, env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    }
    if (language === "bash") {
      // ターミナルで見える出力と同じにするため stderr も合流させる
      return execFileSync("bash", ["-c", 'bash "$0" 2>&1', abs], { cwd: work, env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    }
    if (language === "sql") {
      // 使い捨てのスキーマを作って実行し、最後に削除する (既存のテーブルには触れない)
      const url = process.env.VERIFY_DATABASE_URL ?? process.env.DATABASE_URL;
      if (!url) throw new Error("SQL の検証には VERIFY_DATABASE_URL か DATABASE_URL が必要です");
      const schema = `verify_${randomBytes(6).toString("hex")}`;
      const psql = (args: string[], extraEnv: Record<string, string> = {}) =>
        execFileSync("psql", [url, "-X", ...args], { cwd: work, env: { ...env, ...extraEnv }, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
      psql(["-q", "-c", `CREATE SCHEMA ${schema}`]);
      try {
        return psql(["-v", "ON_ERROR_STOP=1", "-f", abs], { PGOPTIONS: `-c search_path=${schema}` });
      } finally {
        psql(["-q", "-c", `DROP SCHEMA ${schema} CASCADE`, "-c", "SET client_min_messages = warning"]);
      }
    }
    throw new Error(`未対応の言語: ${language}`);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

let failures = 0;
let checked = 0;
for (const lesson of allLessons()) {
  const content = buildLessonContent(lesson); // スキーマ検証も兼ねる
  for (const sample of lesson.content.code) {
    if (!existsSync(path.join(ROOT, sample.verifiedBy))) throw new Error(`${lesson.slug}: ${sample.verifiedBy} がありません`);
    if (!sample.output) continue; // 実行結果のないファイル (プロジェクトの一部) は runner のビルドで検証される
    checked++;
    // 行末の空白は比較しない (psql の表は行末を空白で埋めるため)
    const normalize = (t: string) => t.split("\n").map((l) => l.trimEnd()).join("\n").trimEnd();
    const actual = normalize(sample.runner ? runProject(sample.runner) : run(sample.language, sample.verifiedBy));
    const expected = normalize(sample.output ?? "");
    if (actual === expected) {
      console.log(`OK   ${lesson.slug} (${sample.runner ?? sample.verifiedBy})`);
    } else {
      failures++;
      console.error(`FAIL ${lesson.slug} (${sample.verifiedBy})\n--- expected\n${expected}\n--- actual\n${actual}`);
    }
  }
  void content;
}
console.log(`\n${checked} samples checked, ${failures} failed`);
process.exit(failures > 0 ? 1 : 0);
