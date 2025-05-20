/*
  Warnings:

  - You are about to drop the column `recurring` on the `offers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "offers" DROP COLUMN "recurring",
ALTER COLUMN "closes_at" DROP NOT NULL,
ALTER COLUMN "closes_at" DROP DEFAULT;
