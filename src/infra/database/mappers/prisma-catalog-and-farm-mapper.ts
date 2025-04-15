// Libraries
import { Catalog as PrismaCatalog } from "@prisma/client";

// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { CatalogAndFarm } from "@/core/entities/aggregates/catalog-and-farm";

// Mappers
import { PrismaFarmAndAdminMapper, PrismaFarmAndAdmin } from "@/infra/database/mappers/prisma-farm-and-admin-mapper";

// Repositories
import { CatalogEntityOf, CatalogRepositoryReturnType } from "@/core/repositories/catalogs-repository";

export type PrismaCatalogAndFarm = PrismaCatalog & {
  farm: PrismaFarmAndAdmin;
};

export class PrismaCatalogAndFarmMapper {
  static toDomain<T extends CatalogRepositoryReturnType = "catalog-and-farm">(raw: PrismaCatalogAndFarm): CatalogEntityOf<T> {
    return CatalogAndFarm.create({
      id: new UUID(raw.id),
      fee: raw.fee,
      cycle_id: new UUID(raw.cycle_id),
      farm_id: new UUID(raw.farm_id),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
      farm: PrismaFarmAndAdminMapper.toDomain(raw.farm),
    }) as CatalogEntityOf<T>;
  }
}
