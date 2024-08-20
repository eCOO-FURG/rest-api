// Entities
import { BagMerge } from "@/core/entities/merged/bag-merge";

// Mappers
import { PrismaBagAggreagateMapper } from "@/infra/database/mappers/prisma-bag-aggregate-mapper";
import { PrismaOrderAggregateMapper } from "@/infra/database/mappers/prisma-order-aggregate-mapper";

// Libraries
import { Prisma } from "@prisma/client";

export class PrismaBagMergeMapper {
  static toDomain(
    raw: Prisma.BagGetPayload<{
      include: {
        customer: true;
        orders: { include: { offer: { include: { product: true } } } };
      };
    }>
  ) {
    return BagMerge.create({
      ...PrismaBagAggreagateMapper.toDomain(raw).props,
      orders: raw.orders.map((order) =>
        PrismaOrderAggregateMapper.toDomain(order)
      ),
    });
  }
}
