// Libraries
import { Offer as PrismaOffer, Product as PrismaProduct } from "@prisma/client";

// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { OfferAndDetails } from "@/core/entities/aggregates/offer-and-details";

// Mappers
import { PrismaProductMapper } from "@/infra/database/mappers/prisma-product-mapper";
import {
  PrismaCatalogAndFarm,
  PrismaCatalogAndFarmMapper,
} from "@/infra/database/mappers/prisma-catalog-and-farm-mapper";

// Repositories
import {
  OfferRepositoryReturnType,
  OfferEntityOf,
} from "@/core/repositories/offers-repository";

export type PrismaOfferAndDetails = PrismaOffer & {
  product: PrismaProduct;
  catalog: PrismaCatalogAndFarm;
};

export class PrismaOfferAndDetailsMapper {
  static toDomain<T extends OfferRepositoryReturnType = "offer-and-details">(
    raw: PrismaOfferAndDetails
  ): OfferEntityOf<T> {
    return OfferAndDetails.create({
      amount: raw.amount,
      price: raw.price.toNumber(),
      catalog_id: new UUID(raw.catalog_id),
      catalog: PrismaCatalogAndFarmMapper.toDomain(raw.catalog),
      product_id: new UUID(raw.product_id),
      product: PrismaProductMapper.toDomain(raw.product),
      description: raw.description,
      expires_at: raw.expires_at,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as OfferEntityOf<T>;
  }
}
