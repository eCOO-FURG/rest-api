/*
  Warnings:

  - You are about to drop the column `price` on the `bags` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `catalogs` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `farms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bags" DROP COLUMN "price",
ADD COLUMN     "delivery_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "subtotal" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "catalogs" DROP COLUMN "tax",
ADD COLUMN     "fee" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "farms" DROP COLUMN "tax",
ADD COLUMN     "fee" DOUBLE PRECISION NOT NULL DEFAULT 0;
