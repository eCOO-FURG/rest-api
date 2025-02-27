/*
  Warnings:

  - You are about to drop the column `tax` on the `orders` table. All the data in the column will be lost.
  - Added the required column `tax` to the `catalogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "catalogs" ADD COLUMN     "tax" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "tax";
