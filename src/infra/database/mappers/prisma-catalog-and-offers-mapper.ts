// Libraries
import {
  Catalog as PrismaCatalog,
  Offer as PrismaOffer,
  Farm as PrismaFarm,
} from "@prisma/client";

// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { CatalogAndOffers } from "@/core/entities/aggregates/catalog-and-offers";

// Repositories
import {
  CatalogRepositoryReturnType,
  CatalogEntityOf,
} from "@/core/repositories/catalogs-repository";

// Mappers
import { PrismaFarmMapper } from "@/infra/database/mappers/prisma-farm-mapper";
import {
  PrismaOfferAndProduct,
  PrismaOfferAndProductMapper,
} from "@/infra/database/mappers/prisma-offer-and-product-mapper";

export type PrismaCatalogAndOffers = PrismaCatalog & {
  farm: PrismaFarm;
  offers: PrismaOfferAndProduct[];
};

export class PrismaCatalogAndOffersMapper {
  static toDomain<T extends CatalogRepositoryReturnType>(
    raw: PrismaCatalogAndOffers
  ): CatalogEntityOf<T> {
    return CatalogAndOffers.create({
      id: new UUID(raw.id),
      fee: raw.fee,
      cycle_id: new UUID(raw.cycle_id),
      farm_id: new UUID(raw.farm_id),
      farm: PrismaFarmMapper.toDomain<"farm-and-admin">(raw.farm),
      offers: raw.offers.map(
        PrismaOfferAndProductMapper.toDomain<"offer-and-product">
      ),
    }) as CatalogEntityOf<T>;
  }
}
