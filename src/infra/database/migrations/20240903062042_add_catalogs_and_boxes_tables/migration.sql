/*
  Warnings:

  - You are about to drop the column `cycle_id` on the `offers` table. All the data in the column will be lost.
  - You are about to drop the column `farm_id` on the `offers` table. All the data in the column will be lost.
  - Added the required column `catalog_id` to the `offers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `box_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BOX_STATUS" AS ENUM ('PENDING', 'VERIFIED');

-- DropForeignKey
ALTER TABLE "offers" DROP CONSTRAINT "offers_cycle_id_fkey";

-- DropForeignKey
ALTER TABLE "offers" DROP CONSTRAINT "offers_farm_id_fkey";

-- AlterTable
ALTER TABLE "offers" DROP COLUMN "cycle_id",
DROP COLUMN "farm_id",
ADD COLUMN     "catalog_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "box_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "catalogs" (
    "id" TEXT NOT NULL,
    "farm_id" TEXT NOT NULL,
    "cycle_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "catalogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boxes" (
    "id" TEXT NOT NULL,
    "status" "BOX_STATUS" NOT NULL,
    "catalog_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "boxes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "boxes_catalog_id_key" ON "boxes"("catalog_id");

-- AddForeignKey
ALTER TABLE "catalogs" ADD CONSTRAINT "catalogs_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalogs" ADD CONSTRAINT "catalogs_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "cycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_catalog_id_fkey" FOREIGN KEY ("catalog_id") REFERENCES "catalogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boxes" ADD CONSTRAINT "boxes_catalog_id_fkey" FOREIGN KEY ("catalog_id") REFERENCES "catalogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_box_id_fkey" FOREIGN KEY ("box_id") REFERENCES "boxes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
