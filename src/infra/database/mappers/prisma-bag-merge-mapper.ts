// Entities
import { BagMerge } from "@/core/entities/merged/bag-merge";

// Mappers
import { PrismaBagAggregateMapper } from "@/infra/database/mappers/prisma-bag-aggregate-mapper";
import { PrismaOrderMergeMapper } from "@/infra/database/mappers/prisma-order-merge-mapper";

// Libraries
import { Prisma } from "@prisma/client";

export class PrismaBagMergeMapper {
  static toDomain(
    raw: Prisma.BagGetPayload<{
      include: {
        customer: true;
        address: true;
        orders: {
          include: {
            offer: {
              include: {
                product: true;
                catalog: { include: { farm: { include: { admin: true } } } };
              };
            };
          };
        };
      };
    }>
  ) {
    return BagMerge.create({
      ...PrismaBagAggregateMapper.toDomain(raw).props,
      orders: raw.orders.map((order) => PrismaOrderMergeMapper.toDomain(order)),
    });
  }
}
