-- Renomear a coluna 'caf' para 'tally'
ALTER TABLE "farms" RENAME COLUMN "caf" TO "tally";

-- Adicionar a coluna 'description' com valor padrão
ALTER TABLE "farms" ADD COLUMN "description" TEXT DEFAULT '';

-- Criar índice único para a nova coluna 'tally'
CREATE UNIQUE INDEX "farms_tally_key" ON "farms"("tally");