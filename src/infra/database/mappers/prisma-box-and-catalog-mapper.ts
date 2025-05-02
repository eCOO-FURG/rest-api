// Entities
import { BoxAndCatalog } from "@/core/entities/aggregates/box-and-catalog";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { Box as PrismaBox } from "@prisma/client";

// Repositories
import { BoxRepositoryReturnType, BoxEntityOf } from "@/core/repositories/boxes-repository";

// Mappers
import { PrismaCatalogAndFarmMapper, PrismaCatalogAndFarm } from "@/infra/database/mappers/prisma-catalog-and-farm-mapper";

export type PrismaBoxAndCatalog = PrismaBox & {
  catalog: PrismaCatalogAndFarm;
};

export class PrismaBoxAndCatalogMapper {
  static toDomain<T extends BoxRepositoryReturnType = "box-and-catalog">(raw: PrismaBoxAndCatalog): BoxEntityOf<T> {
    return BoxAndCatalog.create({
      id: new UUID(raw.id),
      status: raw.status,
      catalog_id: new UUID(raw.catalog_id),
      catalog: PrismaCatalogAndFarmMapper.toDomain(raw.catalog),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as BoxEntityOf<T>;
  }
}
