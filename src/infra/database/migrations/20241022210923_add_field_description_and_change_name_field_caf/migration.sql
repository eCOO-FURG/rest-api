/*
  Warnings:

  - You are about to drop the column `caf` on the `farms` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[counterfoil_number]` on the table `farms` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `counterfoil_number` to the `farms` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "farms_caf_key";

-- AlterTable
ALTER TABLE "farms" DROP COLUMN "caf",
ADD COLUMN     "counterfoil_number" TEXT NOT NULL,
ADD COLUMN     "description" TEXT DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "farms_counterfoil_number_key" ON "farms"("counterfoil_number");
