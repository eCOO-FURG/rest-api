/*
  Warnings:

  - You are about to drop the column `user_id` on the `orders` table. All the data in the column will be lost.
  - Added the required column `bag_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `orders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BAG_STATUS" AS ENUM ('PENDING', 'MOUNTED', 'DISPATCHED');

-- CreateEnum
CREATE TYPE "ORDER_STATUS" AS ENUM ('PENDING', 'CANCELLED', 'RECEIVED');

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "user_id",
ADD COLUMN     "bag_id" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ORDER_STATUS" NOT NULL;

-- DropEnum
DROP TYPE "STATUS";

-- CreateTable
CREATE TABLE "bags" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" "BAG_STATUS" NOT NULL,
    "user_id" TEXT NOT NULL,
    "cycle_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "bags_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bags" ADD CONSTRAINT "bags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bags" ADD CONSTRAINT "bags_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_bag_id_fkey" FOREIGN KEY ("bag_id") REFERENCES "bags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
