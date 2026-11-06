/*
  Warnings:

  - You are about to drop the column `failedLoginCount` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lockedUntil` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "failedLoginCount",
DROP COLUMN "lockedUntil";
