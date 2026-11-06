/**
 * 本番・検証環境の初期設定。空の DB (マイグレーション適用済み) に対して 1 回だけ実行する。
 *
 * 1. 教材 (コース・レッスン・課題・ルーブリック) を登録する。すでに登録済みなら何もしない
 * 2. 最初のシステム管理者 (SUPER_ADMIN) を作る。すでにいれば何もしない
 *
 * デモ用の受講生・学習記録は作らない (それは開発用の prisma/seed.ts)。
 *
 * 環境変数:
 *   DATABASE_URL                 接続先 (必須)
 *   BOOTSTRAP_ADMIN_EMAIL        最初の管理者のメールアドレス (管理者を作る場合は必須)
 *   BOOTSTRAP_ADMIN_NAME         表示名 (既定: システム管理者)
 *   BOOTSTRAP_ADMIN_PASSWORD     初回パスワード (12 文字以上)。未指定なら無作為に作って 1 回だけ表示する
 * どちらの場合も初回ログイン時にパスワードの変更を求める。
 */
import { randomBytes } from "node:crypto";
import { COURSE, MODULES, ASSIGNMENTS } from "../content/curriculum";
import { importCurriculum } from "../prisma/import-curriculum";
import { createPrismaClient } from "../src/lib/prisma-client";
import { hashPassword, PASSWORD_MIN_LENGTH } from "../src/lib/auth/password";

const db = createPrismaClient();

function fail(message: string): never {
  console.error(`bootstrap: ${message}`);
  process.exit(1);
}

async function main() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase() || undefined;
  const name = process.env.BOOTSTRAP_ADMIN_NAME?.trim() || "システム管理者";
  const givenPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD || undefined;
  if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail("BOOTSTRAP_ADMIN_EMAIL の形式が正しくありません");
  if (givenPassword !== undefined && givenPassword.length < PASSWORD_MIN_LENGTH) fail(`BOOTSTRAP_ADMIN_PASSWORD は ${PASSWORD_MIN_LENGTH} 文字以上にしてください`);

  const existingCourse = await db.course.findUnique({ where: { slug: COURSE.slug } });
  if (existingCourse) {
    console.log("bootstrap: 教材は登録済みのため変更しません");
  } else {
    // 途中で失敗したときに中途半端な教材が残らないよう、1 つのトランザクションで登録する
    await db.$transaction((tx) => importCurriculum(tx, null), { timeout: 120_000, maxWait: 10_000 });
    await db.setting.upsert({ where: { key: "stagnationThresholdDays" }, create: { key: "stagnationThresholdDays", value: 7 }, update: {} });
    const lessons = MODULES.reduce((n, m) => n + m.lessons.length, 0);
    await db.auditLog.create({ data: { actorId: null, action: "bootstrap.curriculum", metadata: { lessons, assignments: ASSIGNMENTS.length } } });
    console.log(`bootstrap: 教材を登録しました (レッスン ${lessons} 件 / 課題 ${ASSIGNMENTS.length} 件)`);
  }

  const superAdmins = await db.user.count({ where: { role: "SUPER_ADMIN" } });
  if (superAdmins > 0) {
    console.log("bootstrap: システム管理者は作成済みのため変更しません");
    return;
  }
  if (!email) fail("システム管理者がいません。BOOTSTRAP_ADMIN_EMAIL を指定して再実行してください");
  if (await db.user.findUnique({ where: { email } })) fail("そのメールアドレスのアカウントがすでにあります");

  const password = givenPassword ?? randomBytes(18).toString("base64url");
  const admin = await db.user.create({
    data: { email, name, role: "SUPER_ADMIN", passwordHash: await hashPassword(password), mustChangePassword: true },
  });
  await db.auditLog.create({ data: { actorId: null, action: "bootstrap.super_admin", targetType: "User", targetId: admin.id } });
  console.log(`bootstrap: システム管理者を作成しました (${email})。初回ログイン時にパスワードの変更が必要です`);
  if (!givenPassword) console.log(`bootstrap: 初回パスワード (この表示は 1 回だけ): ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
