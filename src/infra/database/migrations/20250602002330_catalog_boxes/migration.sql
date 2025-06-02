-- DropForeignKey
ALTER TABLE "boxes" DROP CONSTRAINT "boxes_catalog_id_fkey";

-- DropIndex
DROP INDEX "boxes_catalog_id_key";

-- AddForeignKey
ALTER TABLE "boxes" ADD CONSTRAINT "boxes_catalog_id_fkey" FOREIGN KEY ("catalog_id") REFERENCES "catalogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
