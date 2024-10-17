/*
  Warnings:

  - You are about to drop the column `active` on the `farms` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FARM_STATUS" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- AlterTable
ALTER TABLE "farms" DROP COLUMN "active",
ADD COLUMN     "status" "FARM_STATUS" DEFAULT 'PENDING';
