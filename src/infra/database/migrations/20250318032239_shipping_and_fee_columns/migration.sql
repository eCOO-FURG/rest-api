/*
  Warnings:

  - You are about to drop the column `delivery_fee` on the `bags` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bags" DROP COLUMN "delivery_fee",
ADD COLUMN     "fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "shipping" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "offers" ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "amount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
ALTER COLUMN "price" SET DEFAULT 0;
