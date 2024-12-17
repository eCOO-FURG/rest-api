/*
  Warnings:

  - You are about to alter the column `amount` on the `offers` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `amount` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - Added the required column `price` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "offers" ALTER COLUMN "amount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "price" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE INTEGER;
