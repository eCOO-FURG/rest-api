/*
  Warnings:

  - Added the required column `status` to the `boxes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BOX_STATUS" AS ENUM ('PENDING', 'VERIFIED');

-- AlterTable
ALTER TABLE "boxes" ADD COLUMN     "status" "BOX_STATUS" NOT NULL;
