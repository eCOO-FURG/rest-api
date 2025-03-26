/*
  Warnings:

  - You are about to drop the column `paid` on the `bags` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `bags` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bag_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customer_id` to the `bags` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bags" DROP CONSTRAINT "bags_user_id_fkey";

-- AlterTable
ALTER TABLE "bags" DROP COLUMN "paid",
DROP COLUMN "user_id",
ADD COLUMN     "customer_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "farms" ADD COLUMN     "photo" TEXT;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "expires_at";

-- CreateIndex
CREATE UNIQUE INDEX "payments_bag_id_key" ON "payments"("bag_id");

-- AddForeignKey
ALTER TABLE "bags" ADD CONSTRAINT "bags_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
