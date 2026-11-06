import "server-only";
import { db } from "@/lib/db";

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
    // 同時実行で二重に公開しないよう、予約がまだ残っている場合だけ更新する
    const claimed = await db.lesson.updateMany({
      where: { id: l.id, scheduledVersionId: l.scheduledVersionId },
      data: { scheduledVersionId: null, publishAt: null, currentVersionId: l.scheduledVersionId, status: "PUBLISHED" },
    });
    if (claimed.count === 0) continue;
    await db.lessonVersion.updateMany({ where: { id: l.scheduledVersionId!, publishedAt: null }, data: { publishedAt: l.publishAt ?? now } });
    await db.auditLog.create({
      data: { actorId: null, action: "lesson.scheduled_publish", targetType: "lesson", targetId: l.id, metadata: { versionId: l.scheduledVersionId } },
    });
  }
  return due.length;
}
