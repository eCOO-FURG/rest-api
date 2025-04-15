// Libraries
import { Catalog as PrismaCatalog } from "@prisma/client";

// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { CatalogAndOffers } from "@/core/entities/aggregates/catalog-and-offers";

// Repositories
import { CatalogRepositoryReturnType, CatalogEntityOf } from "@/core/repositories/catalogs-repository";

// Mappers
import { PrismaFarmAndAdmin, PrismaFarmAndAdminMapper } from "@/infra/database/mappers/prisma-farm-and-admin-mapper";
import { PrismaOfferAndProduct, PrismaOfferAndProductMapper } from "@/infra/database/mappers/prisma-offer-and-product-mapper";

export type PrismaCatalogAndOffers = PrismaCatalog & {
  farm: PrismaFarmAndAdmin;
  offers: PrismaOfferAndProduct[];
};

export class PrismaCatalogAndOffersMapper {
  static toDomain<T extends CatalogRepositoryReturnType = "catalog-and-offers">(raw: PrismaCatalogAndOffers): CatalogEntityOf<T> {
    return CatalogAndOffers.create({
      id: new UUID(raw.id),
      fee: raw.fee,
      cycle_id: new UUID(raw.cycle_id),
      farm_id: new UUID(raw.farm_id),
      farm: PrismaFarmAndAdminMapper.toDomain(raw.farm),
      offers: raw.offers.map(PrismaOfferAndProductMapper.toDomain),
    }) as CatalogEntityOf<T>;
  }
}
