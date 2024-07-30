// Entities
import { UUID } from "@/core/entities/value-objects/uuid";
import { OrderWithOffer } from "@/core/entities/value-objects/order-with-offer";

// Libs
import { Prisma } from "@prisma/client";

// Mappers
import { PrismaProductMapper } from "@/infra/database/mappers/prisma-product-mapper";

export class PrismaOrderWithOfferMapper {
  static toDomain(
    raw: Prisma.OrderGetPayload<{
      include: {
        offer: {
          include: {
            product: true;
          };
        };
      };
    }>
  ) {
    return OrderWithOffer.create({
      ...raw,
      id: new UUID(raw.id),
      bag_id: new UUID(raw.bag_id),
      amount: raw.amount.toNumber(),
      offer: {
        ...raw.offer,
        id: new UUID(raw.offer.id),
        farm_id: new UUID(raw.offer.farm_id),
        cycle_id: new UUID(raw.offer.cycle_id),
        price: raw.offer.amount.toNumber(),
        amount: raw.offer.price.toNumber(),
        product: PrismaProductMapper.toDomain(raw.offer.product),
      },
    });
  }
}
