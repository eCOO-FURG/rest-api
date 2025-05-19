/*
  Warnings:

  - You are about to drop the column `verified` on the `bags` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "BAG_STATUS" ADD VALUE 'VERIFIED';

-- AlterTable
ALTER TABLE "bags" DROP COLUMN "verified";
