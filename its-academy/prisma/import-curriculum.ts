/**
 * 教材 (コース・レベル・レッスン・課題・ルーブリック) を DB に登録する。
 * 開発用の seed と、本番の初期設定 (scripts/bootstrap.ts) の両方から使う。
 */
import type { PrismaClient } from "@prisma/client";
import { ASSIGNMENTS, COURSE, MODULES, STANDARD_RUBRIC } from "../content/curriculum";
import { buildLessonContent } from "../scripts/curriculum-loader";

export type ImportedCurriculum = {
  courseId: string;
  lessonIdBySlug: Map<string, string>;
  versionIdBySlug: Map<string, string>;
  assignmentIdBySlug: Map<string, string>;
};

/** 空の DB に教材を登録する。トランザクション内 (tx) でも呼べる */
export async function importCurriculum(db: Pick<PrismaClient, "rubric" | "course" | "module" | "lesson" | "lessonVersion" | "assignment">, authorId: string | null): Promise<ImportedCurriculum> {
  const rubric = await db.rubric.create({ data: { name: STANDARD_RUBRIC.name, criteria: STANDARD_RUBRIC.criteria } });
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
          changeNote: l.sourceUrl ? "REOrGA 教材を ITS 標準フォーマットで再構成" : "新規作成",
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
        rubricId: rubric.id,
        position: i,
      },
    });
    assignmentIdBySlug.set(a.slug, created.id);
  }
  return { courseId: course.id, lessonIdBySlug, versionIdBySlug, assignmentIdBySlug };
}
