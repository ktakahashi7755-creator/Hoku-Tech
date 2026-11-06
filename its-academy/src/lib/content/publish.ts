import "server-only";
import { db } from "@/lib/db";
import { LessonContentSchema } from "@/lib/content/schema";

/**
 * 公開予約の時刻を過ぎたレッスンを公開する。
 * 定期実行ジョブを持たない構成のため、カリキュラムやレッスンを読み込む前に呼ぶ (冪等)。
 */
export async function applyScheduledPublishes(now = new Date()): Promise<number> {
  const due = await db.lesson.findMany({
    where: { scheduledVersionId: { not: null }, publishAt: { lte: now } },
    select: { id: true, scheduledVersionId: true, publishAt: true },
  });
  for (const l of due) {
    const version = await db.lessonVersion.findUnique({ where: { id: l.scheduledVersionId! }, select: { content: true } });
    // 教材の形式になっていない版 (確定前の下書き) は公開しない。予約を外して記録に残す
    if (!version || !LessonContentSchema.safeParse(version.content).success) {
      const cleared = await db.lesson.updateMany({ where: { id: l.id, scheduledVersionId: l.scheduledVersionId }, data: { scheduledVersionId: null, publishAt: null } });
      if (cleared.count === 1) {
        await db.auditLog.create({ data: { actorId: null, action: "lesson.scheduled_publish_failed", targetType: "lesson", targetId: l.id, metadata: { versionId: l.scheduledVersionId } } });
      }
      continue;
    }
    // 同時実行で二重に公開しないよう、予約がまだ残っている場合だけ更新する。公開日時の記録と同じトランザクションで行う
    await db.$transaction(async (tx) => {
      const claimed = await tx.lesson.updateMany({
        where: { id: l.id, scheduledVersionId: l.scheduledVersionId },
        data: { scheduledVersionId: null, publishAt: null, currentVersionId: l.scheduledVersionId, status: "PUBLISHED" },
      });
      if (claimed.count === 0) return;
      await tx.lessonVersion.updateMany({ where: { id: l.scheduledVersionId!, publishedAt: null }, data: { publishedAt: l.publishAt ?? now } });
      await tx.auditLog.create({
        data: { actorId: null, action: "lesson.scheduled_publish", targetType: "lesson", targetId: l.id, metadata: { versionId: l.scheduledVersionId } },
      });
    });
  }
  return due.length;
}
