/**
 * 教材のサンプルコードを実際に実行し、掲載している実行結果と一致するか検査する。
 * 使い方: npm run verify:code   (失敗時は exit 1)
 */
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { allLessons, buildLessonContent, ROOT } from "./curriculum-loader";

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
    checked++;
    const actual = run(sample.language, sample.verifiedBy).trimEnd();
    const expected = (sample.output ?? "").trimEnd();
    if (actual === expected) {
      console.log(`OK   ${lesson.slug} (${sample.verifiedBy})`);
    } else {
      failures++;
      console.error(`FAIL ${lesson.slug} (${sample.verifiedBy})\n--- expected\n${expected}\n--- actual\n${actual}`);
    }
  }
  void content;
}
console.log(`\n${checked} samples checked, ${failures} failed`);
process.exit(failures > 0 ? 1 : 0);
