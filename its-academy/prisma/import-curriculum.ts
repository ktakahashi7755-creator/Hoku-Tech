/**
 * 教材 (コース・レベル・レッスン・課題・ルーブリック) を DB に登録する。
 * 開発用の seed と、本番の初期設定 (scripts/bootstrap.ts) の両方から使う。
 */
import type { PrismaClient } from "@prisma/client";
import { ASSIGNMENTS, COURSE, MODULES, STANDARD_RUBRIC } from "../content/curriculum";
import type { RubricDef } from "../content/rubrics";
import { buildLessonContent } from "../scripts/curriculum-loader";
import { RubricCriteriaSchema } from "../src/lib/content/schema";

export type ImportedCurriculum = {
  courseId: string;
  lessonIdBySlug: Map<string, string>;
  versionIdBySlug: Map<string, string>;
  assignmentIdBySlug: Map<string, string>;
};

/** 空の DB に教材を登録する。トランザクション内 (tx) でも呼べる */
export async function importCurriculum(db: Pick<PrismaClient, "rubric" | "course" | "module" | "lesson" | "lessonVersion" | "assignment">, authorId: string | null): Promise<ImportedCurriculum> {
  // 課題ごとのルーブリック (指定がなければ標準)。同じルーブリックは 1 行だけ作り、複数の課題で共有する。
  // 採点結果 (reviews.scores) は採点時点の観点と配点を持つため、ルーブリックを後から編集しても過去の採点は変わらない
  const rubricIdByName = new Map<string, string>();
  async function rubricIdOf(def: RubricDef): Promise<string> {
    const known = rubricIdByName.get(def.name);
    if (known) return known;
    const criteria = RubricCriteriaSchema.parse(def.criteria); // 配点の合計が 100 でなければここで止める
    const created = await db.rubric.create({ data: { name: def.name, criteria } });
    rubricIdByName.set(def.name, created.id);
    return created.id;
  }
  await rubricIdOf(STANDARD_RUBRIC);
  const course = await db.course.create({
    data: { slug: COURSE.slug, title: COURSE.title, description: COURSE.description, weeks: COURSE.weeks, status: "PUBLISHED" },
  });

  const lessonIdBySlug = new Map<string, string>();
  const versionIdBySlug = new Map<string, string>();
  const moduleIdByLevel = new Map<string, string>();
  for (const [mi, m] of MODULES.entries()) {
    const mod = await db.module.create({
      data: { courseId: course.id, level: m.level, title: m.title, description: m.description, position: mi, weeks: m.weeks, optional: m.optional ?? false },
    });
    moduleIdByLevel.set(m.level, mod.id);
    for (const [li, l] of m.lessons.entries()) {
      const lesson = await db.lesson.create({ data: { moduleId: mod.id, slug: l.slug, position: li, status: "PUBLISHED" } });
      const version = await db.lessonVersion.create({
        data: {
          lessonId: lesson.id,
          version: 1,
          title: l.title,
          estimatedMinutes: l.estimatedMinutes,
          content: buildLessonContent(l),
          changeNote: l.sourceUrl ? "REOrGA 教材を PROVIDE 標準フォーマットで再構成" : "新規作成",
          publishedAt: new Date(),
          sourceUrl: l.sourceUrl,
          sourcePostId: l.sourcePostId,
          authorId,
        },
      });
      await db.lesson.update({ where: { id: lesson.id }, data: { currentVersionId: version.id } });
      lessonIdBySlug.set(l.slug, lesson.id);
      versionIdBySlug.set(l.slug, version.id);
    }
  }

  const assignmentIdBySlug = new Map<string, string>();
  for (const [i, a] of ASSIGNMENTS.entries()) {
    const created = await db.assignment.create({
      data: {
        slug: a.slug,
        moduleId: moduleIdByLevel.get(a.level)!,
        lessonId: lessonIdBySlug.get(a.afterLesson)!,
        title: a.title,
        type: a.type,
        body: a.body,
        passScore: a.passScore,
        rubricId: await rubricIdOf(a.rubric ?? STANDARD_RUBRIC),
        position: i,
      },
    });
    assignmentIdBySlug.set(a.slug, created.id);
  }
  return { courseId: course.id, lessonIdBySlug, versionIdBySlug, assignmentIdBySlug };
}
