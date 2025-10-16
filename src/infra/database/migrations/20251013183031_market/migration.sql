/*
  Warnings:

  - You are about to drop the column `catalog_id` on the `boxes` table. All the data in the column will be lost.
  - You are about to drop the column `catalog_id` on the `offers` table. All the data in the column will be lost.
  - You are about to drop the `catalogs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cycle_id` to the `boxes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `farm_id` to the `boxes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `farm_id` to the `offers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "boxes" DROP CONSTRAINT "boxes_catalog_id_fkey";

-- DropForeignKey
ALTER TABLE "catalogs" DROP CONSTRAINT "catalogs_cycle_id_fkey";

-- DropForeignKey
ALTER TABLE "catalogs" DROP CONSTRAINT "catalogs_farm_id_fkey";

-- DropForeignKey
ALTER TABLE "offers" DROP CONSTRAINT "offers_catalog_id_fkey";

-- AlterTable
ALTER TABLE "bags" ADD COLUMN     "market_id" TEXT,
ALTER COLUMN "cycle_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "boxes" DROP COLUMN "catalog_id",
ADD COLUMN     "cycle_id" TEXT NOT NULL,
ADD COLUMN     "farm_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "offers" DROP COLUMN "catalog_id",
ADD COLUMN     "cycle_id" TEXT,
ADD COLUMN     "farm_id" TEXT NOT NULL,
ADD COLUMN     "market_id" TEXT;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "box_id" DROP NOT NULL;

-- DropTable
DROP TABLE "catalogs";

-- CreateTable
CREATE TABLE "markets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "open" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "markets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "cycles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "markets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bags" ADD CONSTRAINT "bags_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "markets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boxes" ADD CONSTRAINT "boxes_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boxes" ADD CONSTRAINT "boxes_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
