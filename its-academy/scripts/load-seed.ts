/**
 * 負荷試験用のデータ。通常の seed の後に、受講生を N 名 (既定 200) 追加する。
 * 進捗・理解度チェック・学習時間・提出・採点を、乱数 (固定シード) で現実的な量だけ作る。
 * 使い方: DATABASE_URL=<負荷試験用 DB> npx tsx scripts/load-seed.ts 200
 * 本番環境では実行できない。
 */
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

if (process.env.NODE_ENV === "production") throw new Error("本番環境では実行できません");

const db = new PrismaClient();
const N = Number(process.argv[2] ?? 200);
const OFFSET = Number(process.argv[3] ?? 0); // 追加で実行するときのメールアドレスの番号の開始位置
let seed = 42;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const DAY = 86_400_000;

async function main() {
  const course = await db.course.findFirstOrThrow();
  const lessons = await db.lesson.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ module: { position: "asc" } }, { position: "asc" }],
    select: { id: true, currentVersionId: true },
  });
  const assignments = await db.assignment.findMany({ where: { status: "PUBLISHED" }, select: { id: true, lessonId: true } });
  const instructors = await db.user.findMany({ where: { role: "INSTRUCTOR" }, select: { id: true } });
  const reviewer = instructors[0].id;
  const passwordHash = await hashPassword("load-test-password");
  const now = Date.now();

  for (let i = 0; i < N; i++) {
    const startedDaysAgo = Math.floor(rand() * 80);
    const done = Math.min(lessons.length, Math.floor(rand() * lessons.length));
    const user = await db.user.create({
      data: {
        email: `load${OFFSET + i}@its.example`, name: `負荷 太郎${OFFSET + i}`, passwordHash, affiliation: "負荷試験",
        enrollments: { create: { courseId: course.id, instructorId: instructors[i % instructors.length].id, startedAt: new Date(now - startedDaysAgo * DAY), targetEndDate: new Date(now + (84 - startedDaysAgo) * DAY) } },
      },
    });
    const completed = lessons.slice(0, done);
    const lastActive = Math.floor(rand() * 14);
    await db.lessonProgress.createMany({
      data: completed.map((l, k) => ({
        userId: user.id, lessonId: l.id, lessonVersionId: l.currentVersionId!, status: "COMPLETED" as const,
        firstViewedAt: new Date(now - (lastActive + done - k) * DAY), lastViewedAt: new Date(now - (lastActive + done - k) * DAY),
        completedAt: new Date(now - (lastActive + done - k) * DAY), completedVersionId: l.currentVersionId!,
      })),
    });
    await db.quizAttempt.createMany({
      data: completed.flatMap((l) => {
        const attempts = 1 + Math.floor(rand() * 3);
        return Array.from({ length: attempts }, (_, a) => ({ userId: user.id, lessonVersionId: l.currentVersionId!, answers: [], score: a === attempts - 1 ? 100 : 33, passed: a === attempts - 1 }));
      }),
    });
    await db.learningSession.createMany({
      data: Array.from({ length: done * 2 }, (_, k) => ({ userId: user.id, startedAt: new Date(now - (lastActive + k) * DAY), lastPingAt: new Date(now - (lastActive + k) * DAY), durationSec: 600 + Math.floor(rand() * 3000) })),
    });
    const doneIds = new Set(completed.map((l) => l.id));
    for (const a of assignments.filter((x) => x.lessonId && doneIds.has(x.lessonId))) {
      const attempts = 1 + Math.floor(rand() * 2);
      for (let k = 1; k <= attempts; k++) {
        const pass = k === attempts && rand() > 0.3;
        const sub = await db.submission.create({
          data: { assignmentId: a.id, userId: user.id, attemptNo: k, status: k < attempts ? "CHANGES_REQUESTED" : pass ? "PASSED" : "SUBMITTED", text: "class Main {}", submittedAt: new Date(now - (lastActive + 1) * DAY) },
        });
        if (k < attempts || pass) {
          await db.review.create({ data: { submissionId: sub.id, reviewerId: reviewer, scores: [], totalScore: pass ? 80 : 50, passScore: 70, decision: pass ? "PASS" : "CHANGES_REQUESTED", comment: "負荷試験用のコメントです。" } });
        }
      }
    }
  }
  const counts = await Promise.all([db.user.count(), db.lessonProgress.count(), db.quizAttempt.count(), db.learningSession.count(), db.submission.count(), db.review.count()]);
  console.log(`追加 ${N} 名 / users ${counts[0]} / lesson_progress ${counts[1]} / quiz_attempts ${counts[2]} / learning_sessions ${counts[3]} / submissions ${counts[4]} / reviews ${counts[5]}`);
}

main().finally(() => db.$disconnect());
