import { readFileSync } from "node:fs";
import path from "node:path";
import { LessonContentSchema, type LessonContent } from "../src/lib/content/schema";
import { MODULES, type LessonDef } from "../content/curriculum";

const ROOT = path.resolve(__dirname, "..");

/** verifiedBy のファイルからソースを読み込み、スキーマ検証済みのレッスン本文を返す */
export function buildLessonContent(lesson: LessonDef): LessonContent {
  const code = lesson.content.code.map((c) => ({
    ...c,
    source: readFileSync(path.join(ROOT, c.verifiedBy), "utf8").trimEnd(),
  }));
  const result = LessonContentSchema.safeParse({ ...lesson.content, code });
  if (!result.success) {
    throw new Error(`${lesson.slug}: ${JSON.stringify(result.error.issues, null, 2)}`);
  }
  return result.data;
}

export function allLessons(): LessonDef[] {
  return MODULES.flatMap((m) => m.lessons);
}

export { ROOT };
