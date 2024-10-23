/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `bags` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `bags` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PAYMENT_STATUS" AS ENUM ('PENDING', 'DONE', 'FAILED');

-- CreateEnum
CREATE TYPE "PAYMENT_METHOD" AS ENUM ('CREDIT', 'DEBIT', 'CASH', 'PIX');

-- CreateEnum
CREATE TYPE "PAYMENT_FLAG" AS ENUM ('MASTERCARD', 'VISA', 'OTHER');

-- AlterTable
ALTER TABLE "bags" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "status" "PAYMENT_STATUS" NOT NULL,
    "method" "PAYMENT_METHOD" NOT NULL,
    "flag" "PAYMENT_FLAG",
    "expires_at" TIMESTAMP(3),
    "bag_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bags_code_key" ON "bags"("code");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_bag_id_fkey" FOREIGN KEY ("bag_id") REFERENCES "bags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
