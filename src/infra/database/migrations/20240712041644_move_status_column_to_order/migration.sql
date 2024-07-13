/*
  Warnings:

  - You are about to drop the column `status` on the `offers` table. All the data in the column will be lost.
  - Added the required column `status` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "offers" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "status" "STATUS" NOT NULL;
