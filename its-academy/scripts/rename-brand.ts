/**
 * 登録済みの DB にある旧名称「ITS」を新名称に置き換える (名称変更のときに 1 回だけ使う移行用)。
 *
 * 対象 (コードの変更と同じ置き換え):
 *   - lesson_versions.changeNote  「REOrGA 教材を ITS 標準フォーマットで再構成」→「… PROVIDE 標準フォーマット …」
 *   - lesson_versions.content     サンプルコードの「© ITS 合同会社」→「© プロバイド株式会社」
 *                                 (content/code/ のファイルは教材登録時に本文へ取り込まれるため)
 *   - users.affiliation           「ITS 合同会社」「ITS合同会社」→「プロバイド株式会社」
 *
 * 使い方 (its-academy フォルダで):
 *   npx tsx scripts/rename-brand.ts          … 確認だけ (何も書き込まない)
 *   npx tsx scripts/rename-brand.ts --apply  … 置き換える (1 トランザクション。失敗したら元のまま)
 * 接続先は DATABASE_URL (未設定なら its-academy/.env)。本番に使う前に backup-now.ps1 でバックアップを取る。
 * もう一度実行しても、置き換え済みの行は対象にならない。
 */
import type { Prisma } from "@prisma/client";
import { createPrismaClient } from "../src/lib/prisma-client";
import { loadLocalEnv } from "./load-env";

loadLocalEnv();
const db = createPrismaClient();
const apply = process.argv.includes("--apply");

const rename = (s: string) =>
  s.replaceAll("ITS 標準フォーマット", "PROVIDE 標準フォーマット").replace(/ITS ?合同会社/g, "プロバイド株式会社");
const hasOld = (s: string) => s !== rename(s);

async function main() {
  const allVersions = await db.lessonVersion.findMany({ select: { id: true, title: true, changeNote: true, content: true } });
  const versions = allVersions.flatMap((v) => {
    const contentText = JSON.stringify(v.content);
    const note = v.changeNote !== null && hasOld(v.changeNote) ? rename(v.changeNote) : undefined;
    const content = hasOld(contentText) ? (JSON.parse(rename(contentText)) as Prisma.InputJsonValue) : undefined;
    return note !== undefined || content !== undefined ? [{ id: v.id, title: v.title, note, content }] : [];
  });
  const users = (await db.user.findMany({ where: { affiliation: { contains: "合同会社" } }, select: { id: true, affiliation: true } }))
    .filter((u) => hasOld(u.affiliation!));

  // 置き換えの対象外で「ITS」が残っていないかの確認 (表示のみ)
  const others = allVersions.filter((v) => !versions.some((x) => x.id === v.id) && /\bITS\b/.test(rename(JSON.stringify(v)))).length;

  console.log(`レッスンの版: 変更メモ ${versions.filter((v) => v.note).length} 件、本文 ${versions.filter((v) => v.content).length} 件`);
  for (const v of versions.filter((x) => x.content)) console.log(`  本文を置き換える版: ${v.title}`);
  console.log(`ユーザーの所属: ${users.length} 件`);
  console.log(`(参考) それ以外で「ITS」を含むレッスンの版: ${others} 件`);

  if (!apply) {
    console.log("確認のみで終了しました (DB は変更していません)。書き込むには --apply を付けて実行します。");
    return;
  }

  await db.$transaction(
    async (tx) => {
      for (const v of versions) {
        await tx.lessonVersion.update({
          where: { id: v.id },
          data: { ...(v.note !== undefined && { changeNote: v.note }), ...(v.content !== undefined && { content: v.content }) },
        });
      }
      for (const u of users) await tx.user.update({ where: { id: u.id }, data: { affiliation: rename(u.affiliation!) } });
    },
    { timeout: 120_000, maxWait: 10_000 },
  );
  console.log(`置き換えました: レッスンの版 ${versions.length} 件、所属 ${users.length} 件`);
}

main()
  .catch((e) => {
    console.error("rename-brand: 失敗しました (DB は変更されていません)", e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
