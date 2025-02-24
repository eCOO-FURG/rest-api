-- AlterTable
ALTER TABLE "offers" ADD COLUMN     "expires_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "perishable" BOOLEAN NOT NULL DEFAULT false;
