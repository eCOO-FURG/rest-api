// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Offer } from "@/core/entities/offer";

// Repositories
import { OfferEntityOf, OfferRepositoryReturnType } from "@/core/repositories/offers-repository";

// Libraries
import { Prisma, Offer as PrismaOffer } from "@prisma/client";

export class PrismaOfferMapper {
  static toDomain<T extends OfferRepositoryReturnType = "offer">(
    raw: PrismaOffer,
  ): OfferEntityOf<T> {
    return Offer.create({
      id: new UUID(raw.id),
      amount: raw.amount,
      price: raw.price.toNumber(),
      cycle_id: raw.cycle_id ? new UUID(raw.cycle_id) : null,
      market_id: raw.market_id ? new UUID(raw.market_id) : null,
      farm_id: new UUID(raw.farm_id),
      product_id: new UUID(raw.product_id),
      description: raw.description,
      comment: raw.comment,
      opens_at: raw.opens_at,
      fee: raw.fee.toNumber(),
      active: raw.active,
      closes_at: raw.closes_at,
      expires_at: raw.expires_at,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as OfferEntityOf<T>;
  }

  static toPrisma(offer: Offer): Prisma.OfferUncheckedCreateInput {
    return {
      id: offer.id.value,
      product_id: offer.product_id.value,
      farm_id: offer.farm_id.value,
      cycle_id: offer.cycle_id ? offer.cycle_id.value : null,
      market_id: offer.market_id ? offer.market_id.value : null,
      description: offer.description,
      opens_at: offer.opens_at,
      comment: offer.comment,
      amount: offer.amount,
      price: offer.price,
      fee: offer.fee,
      closes_at: offer.closes_at,
      active: offer.active,
      expires_at: offer.expires_at,
      updated_at: offer.updated_at,
      created_at: offer.created_at,
    };
  }
}
