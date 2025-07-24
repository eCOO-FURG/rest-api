/*
  Warnings:

  - Added the required column `opens_at` to the `offers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "offers" ADD COLUMN     "opens_at" TIMESTAMP(3) NOT NULL;
