/**
 * レッスンの版の扱いのルール (純粋関数)。
 */

/**
 * 下書き保存で上書きしてよい版か。未公開で、公開中・予約中の版でないこと
 * (公開直前・公開中の版を下書き保存が書き換えないように)。
 */
export function isEditableDraft(
  version: { id: string; publishedAt: Date | null },
  lesson: { currentVersionId: string | null; scheduledVersionId: string | null },
): boolean {
  return !version.publishedAt && version.id !== lesson.currentVersionId && version.id !== lesson.scheduledVersionId;
}
