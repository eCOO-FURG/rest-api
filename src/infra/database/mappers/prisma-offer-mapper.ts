// Entities
import { Offer } from "@/core/entities/offer";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libs
import { Prisma, Offer as PrismaOffer } from "@prisma/client";

export class PrismaOfferMapper {
  static toDomain(raw: PrismaOffer) {
    return Offer.create({
      ...raw,
      id: new UUID(raw.id),
      catalog_id: new UUID(raw.catalog_id),
      product_id: new UUID(raw.product_id),
      amount: raw.amount.toNumber(),
      price: raw.price.toNumber(),
    });
  }

  static toPrisma(offer: Offer): Prisma.OfferUncheckedCreateInput {
    return {
      id: offer.id.value,
      catalog_id: offer.catalog_id.value,
      product_id: offer.product_id.value,
      description: offer.description,
      amount: offer.amount,
      price: offer.price,
      updated_at: offer.updated_at,
      created_at: offer.created_at,
    };
  }
}
