// Libraries
import { Catalog as PrismaCatalog, Farm as PrismaFarm } from "@prisma/client";

// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { CatalogAndFarm } from "@/core/entities/aggregates/catalog-and-farm";

// Mappers
import { PrismaFarmMapper } from "@/infra/database/mappers/prisma-farm-mapper";

// Repositories
import {
  CatalogEntityOf,
  CatalogRepositoryReturnType,
} from "@/core/repositories/catalogs-repository";

export type PrismaCatalogAndFarm = PrismaCatalog & {
  farm: PrismaFarm;
};

export class PrismaCatalogAndFarmMapper {
  static toDomain<T extends CatalogRepositoryReturnType>(
    raw: PrismaCatalogAndFarm
  ): CatalogEntityOf<T> {
    return CatalogAndFarm.create({
      id: new UUID(raw.id),
      fee: raw.fee,
      cycle_id: new UUID(raw.cycle_id),
      farm_id: new UUID(raw.farm_id),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
      farm: PrismaFarmMapper.toDomain<"farm-and-admin">(raw.farm),
    }) as CatalogEntityOf<T>;
  }
}
