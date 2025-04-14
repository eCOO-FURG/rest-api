/*
  Warnings:

  - You are about to drop the column `price` on the `orders` table. All the data in the column will be lost.
  - Added the required column `fee` to the `offers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "offers" ADD COLUMN "fee" DECIMAL(10,2) NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN "subtotal" DECIMAL(10,2) NULL;

-- Update values
UPDATE "offers" SET "fee" = "offer"."price" * ("catalog"."fee" / 100)
FROM "catalog"
WHERE "offers"."catalog_id" = "catalog"."id";

UPDATE "orders" SET "subtotal" = "price";

-- AlterTable
ALTER TABLE "offers" ALTER COLUMN "fee" SET NOT NULL;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "subtotal" SET NOT NULL;


