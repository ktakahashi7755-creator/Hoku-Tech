/**
 * 開発・検証用の初期データ。本番 (NODE_ENV=production) では実行できない。
 * 既存データをすべて削除してから作り直す。
 *
 * ログイン用パスワードは SEED_PASSWORD 環境変数で指定する (未指定時は開発用の既定値)。
 */
import { PrismaClient, type Prisma } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";
import { ASSIGNMENTS, COURSE, MODULES, STANDARD_RUBRIC } from "../content/curriculum";
import { buildLessonContent } from "../scripts/curriculum-loader";

if (process.env.NODE_ENV === "production") {
  throw new Error("seed は本番環境では実行できません");
}

const db = new PrismaClient();
const PASSWORD = process.env.SEED_PASSWORD ?? "its-dev-password-2026";
const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();
const daysAgo = (n: number) => new Date(now - n * DAY);

async function reset() {
  const tables = await db.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'`;
  const list = tables.map((t) => `"public"."${t.tablename}"`).join(", ");
  if (list) await db.$executeRawUnsafe(`TRUNCATE TABLE ${list} CASCADE`);
}

async function main() {
  await reset();
  const passwordHash = await hashPassword(PASSWORD);

  const mkUser = (data: Omit<Prisma.UserCreateInput, "passwordHash">) => db.user.create({ data: { ...data, passwordHash } });
  const superAdmin = await mkUser({ email: "super@its.example", name: "システム 管理者", role: "SUPER_ADMIN" });
  const admin = await mkUser({ email: "admin@its.example", name: "管理 太郎", role: "ADMIN", affiliation: "ITS 合同会社 教育部" });
  const instructorA = await mkUser({ email: "instructor@its.example", name: "講師 一郎", role: "INSTRUCTOR", affiliation: "ITS 合同会社 教育部" });
  const instructorB = await mkUser({ email: "instructor2@its.example", name: "講師 二葉", role: "INSTRUCTOR", affiliation: "ITS 合同会社 教育部" });
  const students = await Promise.all([
    mkUser({ email: "student@its.example", name: "山田 花子", affiliation: "2026 年 10 月期", joinedAt: daysAgo(20) }),
    mkUser({ email: "student2@its.example", name: "佐藤 健", affiliation: "2026 年 10 月期", joinedAt: daysAgo(20) }),
    mkUser({ email: "student3@its.example", name: "鈴木 美咲", affiliation: "2026 年 10 月期", joinedAt: daysAgo(20) }),
    mkUser({ email: "student4@its.example", name: "高橋 陽太", affiliation: "2026 年 11 月期", joinedAt: daysAgo(3) }),
  ]);

  // ---- 教材 ----
  const rubric = await db.rubric.create({ data: { name: STANDARD_RUBRIC.name, criteria: STANDARD_RUBRIC.criteria } });
  const course = await db.course.create({
    data: { slug: COURSE.slug, title: COURSE.title, description: COURSE.description, weeks: COURSE.weeks, status: "PUBLISHED" },
  });

  const lessonIdBySlug = new Map<string, string>();
  const versionIdBySlug = new Map<string, string>();
  const moduleIdByLevel = new Map<string, string>();
  for (const [mi, m] of MODULES.entries()) {
    const mod = await db.module.create({
      data: { courseId: course.id, level: m.level, title: m.title, description: m.description, position: mi, weeks: m.weeks },
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
          authorId: admin.id,
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

  await db.setting.create({ data: { key: "stagnationThresholdDays", value: 7 } });

  // ---- 受講登録 ----
  const [hanako, ken, misaki, yota] = students;
  const enroll = (userId: string, instructorId: string, startedDaysAgo: number) =>
    db.enrollment.create({
      data: {
        userId,
        courseId: course.id,
        instructorId,
        startedAt: daysAgo(startedDaysAgo),
        targetEndDate: new Date(now + (84 - startedDaysAgo) * DAY),
      },
    });
  await enroll(hanako.id, instructorA.id, 18);
  await enroll(ken.id, instructorA.id, 18);
  await enroll(misaki.id, instructorB.id, 18);
  await enroll(yota.id, instructorB.id, 2);

  // ---- 学習の記録 (デモ用) ----
  const lessonSlugs = MODULES.flatMap((m) => m.lessons.map((l) => l.slug));
  async function complete(userId: string, slugs: string[], lastDaysAgo: number) {
    for (const [i, slug] of slugs.entries()) {
      const at = daysAgo(lastDaysAgo + (slugs.length - 1 - i));
      const versionId = versionIdBySlug.get(slug)!;
      await db.quizAttempt.create({ data: { userId, lessonVersionId: versionId, answers: [], score: 100, passed: true, createdAt: at } });
      await db.lessonProgress.create({
        data: { userId, lessonId: lessonIdBySlug.get(slug)!, lessonVersionId: versionId, status: "COMPLETED", firstViewedAt: at, lastViewedAt: at, completedAt: at, completedVersionId: versionId },
      });
      await db.learningSession.create({ data: { userId, lessonId: lessonIdBySlug.get(slug)!, startedAt: at, lastPingAt: at, durationSec: 50 * 60 } });
    }
  }
  async function inProgress(userId: string, slug: string, at: Date) {
    await db.lessonProgress.create({
      data: { userId, lessonId: lessonIdBySlug.get(slug)!, lessonVersionId: versionIdBySlug.get(slug)!, firstViewedAt: at, lastViewedAt: at },
    });
    await db.enrollment.updateMany({ where: { userId }, data: { currentLessonId: lessonIdBySlug.get(slug)! } });
    await db.learningSession.create({ data: { userId, lessonId: lessonIdBySlug.get(slug)!, startedAt: at, lastPingAt: at, durationSec: 20 * 60 } });
  }

  // 山田: L2 の途中まで。課題 1 は合格、課題 2 は未着手
  // デモの状態はレッスンの slug で指定する (レッスンを追加しても状態がずれないように)
  const upTo = (slug: string) => {
    const i = lessonSlugs.indexOf(slug);
    if (i < 0) throw new Error(`seed: レッスン ${slug} がありません`);
    return lessonSlugs.slice(0, i + 1);
  };
  await complete(hanako.id, upTo("l2-conditionals"), 0);
  await inProgress(hanako.id, "l2-loops-arrays", new Date(now - 60 * 60 * 1000));
  // 佐藤: L2 まで完了。課題 2 は修正依頼
  await complete(ken.id, upTo("l2-methods"), 1);
  // 鈴木: L1 で 9 日止まっている (停滞検知のデモ)
  await complete(misaki.id, upTo("l1-terminal-basics"), 9);
  await db.quizAttempt.create({ data: { userId: misaki.id, lessonVersionId: versionIdBySlug.get("l1-git-basics")!, answers: [], score: 50, passed: false, createdAt: daysAgo(9) } });
  // 高橋: 開始直後
  await inProgress(yota.id, "l0-how-to-learn", daysAgo(1));

  const scores = (values: number[]) =>
    STANDARD_RUBRIC.criteria.map((c, i) => ({ key: c.key, label: c.label, weight: c.weight, score: Math.min(values[i], c.weight) }));

  // 課題 1 (山田: 合格 / 佐藤: 合格)
  for (const [user, total] of [[hanako, [22, 18, 13, 8, 7, 10, 8]], [ken, [25, 20, 12, 8, 6, 10, 7]]] as const) {
    const sub = await db.submission.create({
      data: { assignmentId: assignmentIdBySlug.get("a1-github-profile")!, userId: user.id, attemptNo: 1, status: "PASSED", repoUrl: `https://github.com/example-${user.email.split("@")[0]}/its-profile`, submittedAt: daysAgo(6) },
    });
    const s = scores([...total]);
    await db.review.create({
      data: { submissionId: sub.id, reviewerId: instructorA.id, scores: s, totalScore: s.reduce((a, b) => a + b.score, 0), passScore: 70, decision: "PASS", comment: "ブランチと PR の流れが正しくできています。commit メッセージも形式どおりです。", createdAt: daysAgo(5) },
    });
  }
  // 課題 2 (佐藤: 1 回目修正依頼)
  const kenSub = await db.submission.create({
    data: {
      assignmentId: assignmentIdBySlug.get("a2-grade-calculator")!,
      userId: ken.id,
      attemptNo: 1,
      status: "CHANGES_REQUESTED",
      text: "public class Main {\n    static String grade(int score) {\n        if (score > 80) return \"A\";\n        if (score > 60) return \"B\";\n        return \"C\";\n    }\n}",
      note: "AI は使用していません。",
      submittedAt: daysAgo(2),
    },
  });
  const ks = scores([15, 8, 12, 7, 4, 6, 6]);
  await db.review.create({
    data: {
      submissionId: kenSub.id,
      reviewerId: instructorA.id,
      scores: ks,
      totalScore: ks.reduce((a, b) => a + b.score, 0),
      passScore: 70,
      decision: "CHANGES_REQUESTED",
      comment: "80 点ちょうど・60 点ちょうどの評価が仕様と違います (> ではなく >=)。入力エラーの処理と統計の表示も追加してください。",
      createdAt: daysAgo(1),
    },
  });

  // 講師コメント・スキル評価
  await db.instructorComment.create({ data: { studentId: misaki.id, authorId: instructorB.id, body: "L1 Git の理解度チェックで止まっている。次回面談で commit とブランチの流れを一緒に確認する。", visibility: "INTERNAL", createdAt: daysAgo(3) } });
  await db.instructorComment.create({ data: { studentId: ken.id, authorId: instructorA.id, body: "境界値の考え方を意識できると、さらに良くなります。", visibility: "STUDENT", createdAt: daysAgo(1) } });
  for (const [skill, level] of [["git", 4], ["java_basics", 3], ["communication", 4]] as const) {
    await db.skillAssessment.create({ data: { userId: hanako.id, assessorId: instructorA.id, skill, level, createdAt: daysAgo(4) } });
  }
  await db.skillAssessment.create({ data: { userId: ken.id, assessorId: instructorA.id, skill: "java_basics", level: 2, note: "条件の境界の扱いが不安定", createdAt: daysAgo(1) } });

  await db.auditLog.create({ data: { actorId: superAdmin.id, action: "seed.run", metadata: { lessons: lessonSlugs.length } } });

  console.log(`seed 完了: レッスン ${lessonSlugs.length} 件 / 課題 ${ASSIGNMENTS.length} 件 / ユーザー ${4 + students.length} 名`);
  console.log(`ログイン: student@its.example / instructor@its.example / admin@its.example (パスワード: ${process.env.SEED_PASSWORD ? "SEED_PASSWORD の値" : PASSWORD})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
