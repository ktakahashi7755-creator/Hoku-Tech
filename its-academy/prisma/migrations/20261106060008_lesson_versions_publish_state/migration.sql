-- AlterTable
ALTER TABLE "lesson_versions" ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "scheduledVersionId" TEXT;

-- 既存の「現在の版」は公開済みとして扱う
UPDATE "lesson_versions" v SET "publishedAt" = v."createdAt"
FROM "lessons" l WHERE l."currentVersionId" = v."id" AND v."publishedAt" IS NULL;
