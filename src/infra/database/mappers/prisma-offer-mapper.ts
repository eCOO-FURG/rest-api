// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Offer } from "@/core/entities/offer";

// Repositories
import { OfferEntityOf, OfferRepositoryReturnType } from "@/core/repositories/offers-repository";

// Libraries
import { Prisma, Offer as PrismaOffer } from "@prisma/client";

export class PrismaOfferMapper {
  static toDomain<T extends OfferRepositoryReturnType = "offer">(raw: PrismaOffer): OfferEntityOf<T> {
    return Offer.create({
      id: new UUID(raw.id),
      amount: raw.amount,
      price: raw.price.toNumber(),
      catalog_id: new UUID(raw.catalog_id),
      product_id: new UUID(raw.product_id),
      description: raw.description,
      fee: raw.fee.toNumber(),
      expires_at: raw.expires_at,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as OfferEntityOf<T>;
  }

  static toPrisma(offer: Offer): Prisma.OfferUncheckedCreateInput {
    return {
      id: offer.id.value,
      catalog_id: offer.catalog_id.value,
      product_id: offer.product_id.value,
      description: offer.description,
      amount: offer.amount,
      price: offer.price,
      fee: offer.fee,
      expires_at: offer.expires_at,
      updated_at: offer.updated_at,
      created_at: offer.created_at,
    };
  }
}
