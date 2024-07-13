// Entities
import { UUID } from "@/core/entities/value-objects/uuid";
import { OfferWithProductAndCycle } from "@/core/entities/value-objects/offer-with-product-and-cycle";

// Libs
import { Prisma } from "@prisma/client";

// Mappers
import { PrismaProductMapper } from "@/infra/database/mappers/prisma-product-mapper";
import { PrismaCycleMapper } from "@/infra/database/mappers/prisma-cycle-mapper";

export class PrismaOfferWithProductAndCycleMapper {
  static toDomain(
    raw: Prisma.OfferGetPayload<{
      include: {
        product: true;
        cycle: true;
      };
    }>
  ) {
    return OfferWithProductAndCycle.create({
      ...raw,
      id: new UUID(raw.id),
      farm_id: new UUID(raw.farm_id),
      amount: raw.amount.toNumber(),
      price: raw.price.toNumber(),
      product: PrismaProductMapper.toDomain(raw.product),
      cycle: PrismaCycleMapper.toDomain(raw.cycle),
    });
  }
}
