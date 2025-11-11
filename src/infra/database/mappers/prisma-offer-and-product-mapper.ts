// Libraries
import { Offer as PrismaOffer, Product as PrismaProduct } from "@prisma/client";

// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { OfferAndProduct } from "@/core/entities/aggregates/offer-and-product";

// Mappers
import { PrismaProductMapper } from "@/infra/database/mappers/prisma-product-mapper";

// Repositories
import { OfferRepositoryReturnType, OfferEntityOf } from "@/core/repositories/offers-repository";

export type PrismaOfferAndProduct = PrismaOffer & {
  product: PrismaProduct;
};

export class PrismaOfferAndProductMapper {
  static toDomain<T extends OfferRepositoryReturnType = "offer-and-product">(
    raw: PrismaOfferAndProduct,
  ): OfferEntityOf<T> {
    return OfferAndProduct.create({
      id: new UUID(raw.id),
      amount: raw.amount,
      price: raw.price.toNumber(),
      farm_id: new UUID(raw.farm_id),
      cycle_id: raw.cycle_id ? new UUID(raw.cycle_id) : null,
      market_id: raw.market_id ? new UUID(raw.market_id) : null,
      product_id: new UUID(raw.product_id),
      opens_at: raw.opens_at,
      product: PrismaProductMapper.toDomain(raw.product),
      comment: raw.comment,
      active: raw.active,
      closes_at: raw.closes_at,
      description: raw.description,
      expires_at: raw.expires_at,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as OfferEntityOf<T>;
  }
}
