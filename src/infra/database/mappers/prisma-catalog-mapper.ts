// Libraries
import { Prisma, Catalog as PrismaCatalog } from "@prisma/client";

// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Catalog } from "@/core/entities/catalog";

// Mappers
import { CatalogEntityOf } from "@/core/repositories/catalogs-repository";

// Repositories
import { CatalogRepositoryReturnType } from "@/core/repositories/catalogs-repository";

export class PrismaCatalogMapper {
  static toDomain<T extends CatalogRepositoryReturnType = "catalog">(
    raw: PrismaCatalog
  ): CatalogEntityOf<T> {
    return Catalog.create({
      id: new UUID(raw.id),
      fee: raw.fee,
      cycle_id: new UUID(raw.cycle_id),
      farm_id: new UUID(raw.farm_id),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as CatalogEntityOf<T>;
  }

  static toPrisma(catalog: Catalog): Prisma.CatalogUncheckedCreateInput {
    return {
      id: catalog.id.value,
      fee: catalog.fee,
      cycle_id: catalog.cycle_id.value,
      farm_id: catalog.farm_id.value,
      created_at: catalog.created_at,
      updated_at: catalog.updated_at,
    };
  }
}
