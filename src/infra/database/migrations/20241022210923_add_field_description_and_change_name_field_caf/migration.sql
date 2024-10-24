-- Renomear a coluna 'caf' para 'counterfoil_number'
ALTER TABLE "farms" RENAME COLUMN "caf" TO "counterfoil_number";

-- Adicionar a coluna 'description' com valor padrão
ALTER TABLE "farms" ADD COLUMN "description" TEXT DEFAULT '';

-- Criar índice único para a nova coluna 'counterfoil_number'
CREATE UNIQUE INDEX "farms_counterfoil_number_key" ON "farms"("counterfoil_number");