// Entities
import { Offer } from "@/core/entities/offer";
import { UUID } from "@/core/entities/value-objects/uuid";

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
      ...offer.props,
      id: offer.id.value,
      cycle_id: offer.cycle_id.value,
      farm_id: offer.farm_id.value,
      product_id: offer.product_id.value,
    };
  }
}
