// Entities
import { OrderMerge } from "@/core/entities/merged/order-merge";
import { Prisma } from "@prisma/client";
import { UUID } from "@/core/entities/aggregates/uuid";

// Mappers
import { PrismaOfferMergeMapper } from "@/infra/database/mappers/prisma-offer-merge-mapper";

export class PrismaOrderMergeMapper {
  static toDomain(
    raw: Prisma.OrderGetPayload<{
      include: {
        offer: {
          include: {
            product: true;
            catalog: { include: { farm: { include: { admin: true } } } };
          };
        };
      };
    }>
  ) {
    return OrderMerge.create({
      ...raw,
      id: new UUID(raw.id),
      offer: PrismaOfferMergeMapper.toDomain(raw.offer),
      amount: raw.amount.toNumber(),
      bag_id: new UUID(raw.bag_id),
      box_id: new UUID(raw.box_id),
    });
  }
}
