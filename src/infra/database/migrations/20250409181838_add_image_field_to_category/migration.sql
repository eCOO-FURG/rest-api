DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'categories' 
        AND column_name = 'image'
    ) THEN
        ALTER TABLE "categories" ADD COLUMN "image" TEXT;

        UPDATE "categories" SET "image" = 'https://example.com/default-category-image.jpg' WHERE "image" IS NULL;

        ALTER TABLE "categories" ALTER COLUMN "image" SET NOT NULL;
    END IF;
END $$;
