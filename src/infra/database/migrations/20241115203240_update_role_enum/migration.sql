/*
 Warnings:
 
 - The values [ADMIN] on the enum `ROLE` will be removed. If these variants are still used in the database, this will fail.
 
 */
-- Begin the transaction
BEGIN;
-- 1. Create a new enum type with the updated values
CREATE TYPE "ROLE_new" AS ENUM ('PRODUCER', 'USER', 'MANAGER', 'BROKER');
-- 2. Remove the default value from the 'roles' column
ALTER TABLE "users"
ALTER COLUMN "roles" DROP DEFAULT;
-- 3. Update the 'roles' column to use the new enum type and map 'ADMIN' to 'BROKER', keeping other roles untouched
ALTER TABLE "users"
ALTER COLUMN "roles" TYPE "ROLE_new" [] USING (
    array_replace("roles"::text [], 'ADMIN', 'BROKER')::"ROLE_new" []
  );
-- 4. Rename the old enum type to avoid conflicts
ALTER TYPE "ROLE"
RENAME TO "ROLE_old";
-- 5. Rename the new enum type to the original name
ALTER TYPE "ROLE_new"
RENAME TO "ROLE";
-- 6. Drop the old enum type
DROP TYPE "ROLE_old";
-- 7. Restore the default value for the 'roles' column
ALTER TABLE "users"
ALTER COLUMN "roles"
SET DEFAULT ARRAY ['USER']::"ROLE" [];
-- Commit the transaction
COMMIT;