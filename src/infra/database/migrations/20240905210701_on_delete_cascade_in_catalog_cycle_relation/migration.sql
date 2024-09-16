-- DropForeignKey
ALTER TABLE "catalogs" DROP CONSTRAINT "catalogs_cycle_id_fkey";

-- AddForeignKey
ALTER TABLE "catalogs" ADD CONSTRAINT "catalogs_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
