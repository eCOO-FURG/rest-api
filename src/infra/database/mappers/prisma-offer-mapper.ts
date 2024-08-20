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
      cycle_id: new UUID(raw.cycle_id),
      farm_id: new UUID(raw.farm_id),
      product_id: new UUID(raw.product_id),
      amount: raw.amount.toNumber(),
      price: raw.price.toNumber(),
    });
  }

  static toPrisma(offer: Offer): Prisma.OfferUncheckedCreateInput {
    return {
      id: offer.id.value,
      cycle_id: offer.cycle_id.value,
      farm_id: offer.farm_id.value,
      product_id: offer.product_id.value,
      description: offer.description,
      amount: offer.amount,
      price: offer.price,
      updated_at: offer.updated_at,
      created_at: offer.created_at,
    };
  }
}
