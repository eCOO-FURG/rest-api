/*
  Warnings:

  - Made the column `status` on table `farms` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "farms" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "description" DROP DEFAULT;
