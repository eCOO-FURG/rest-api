// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { OrderAggregate } from "@/core/entities/aggregates/order-aggregate";

// Libs
import { Prisma } from "@prisma/client";

// Mappers
import { PrismaOfferAggregateMapper } from "@/infra/database/mappers/prisma-offer-aggregate-mapper";

export class PrismaOrderAggregateMapper {
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
    return OrderAggregate.create({
      ...raw,
      id: new UUID(raw.id),
      bag_id: new UUID(raw.bag_id),
      amount: raw.amount.toNumber(),
      offer: PrismaOfferAggregateMapper.toDomain(raw.offer),
      box_id: new UUID(raw.box_id),
    });
  }
}
