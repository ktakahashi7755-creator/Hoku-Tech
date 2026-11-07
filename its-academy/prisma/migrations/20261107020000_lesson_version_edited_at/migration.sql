-- 同時編集の確認には「下書きとして保存した日時」だけを使う (公開・予約・確定では変えない)
ALTER TABLE "lesson_versions" RENAME COLUMN "updatedAt" TO "editedAt";
