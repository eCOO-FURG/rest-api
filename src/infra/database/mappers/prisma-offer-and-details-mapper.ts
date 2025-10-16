// Libraries
import { Offer as PrismaOffer, Product as PrismaProduct } from "@prisma/client";

// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { OfferAndDetails } from "@/core/entities/aggregates/offer-and-details";

// Mappers
import { PrismaProductMapper } from "@/infra/database/mappers/prisma-product-mapper";
import { PrismaProducer } from "@/infra/database/mappers/prisma-producer-mapper";
import { PrismaProducerMapper } from "@/infra/database/mappers/prisma-producer-mapper";

// Repositories
import { OfferRepositoryReturnType, OfferEntityOf } from "@/core/repositories/offers-repository";

export type PrismaOfferAndDetails = PrismaOffer & {
  product: PrismaProduct;
  farm: PrismaProducer;
};

export class PrismaOfferAndDetailsMapper {
  static toDomain<T extends OfferRepositoryReturnType = "offer-and-details">(
    raw: PrismaOfferAndDetails,
  ): OfferEntityOf<T> {
    return OfferAndDetails.create({
      id: new UUID(raw.id),
      amount: raw.amount,
      price: raw.price.toNumber(),
      fee: raw.fee.toNumber(),
      opens_at: raw.opens_at,
      farm_id: new UUID(raw.farm_id),
      product_id: new UUID(raw.product_id),
      cycle_id: raw.cycle_id ? new UUID(raw.cycle_id) : null,
      market_id: raw.market_id ? new UUID(raw.market_id) : null,
      farm: PrismaProducerMapper.toDomain(raw.farm),
      product: PrismaProductMapper.toDomain(raw.product),
      description: raw.description,
      comment: raw.comment,
      active: raw.active,
      closes_at: raw.closes_at,
      expires_at: raw.expires_at,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as OfferEntityOf<T>;
  }
}
