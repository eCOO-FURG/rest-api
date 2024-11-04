/*
  Warnings:

  - You are about to drop the column `status` on the `boxes` table. All the data in the column will be lost.
  - Added the required column `verified` to the `boxes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "boxes" DROP COLUMN "status",
ADD COLUMN     "verified" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "BOX_STATUS";
