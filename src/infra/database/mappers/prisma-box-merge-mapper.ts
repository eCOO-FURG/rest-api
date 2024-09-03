// Entities
import { BoxMerge } from "@/core/entities/merged/box-merge";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { Prisma } from "@prisma/client";

// Mappers
import { PrismaOrderAggregateMapper } from "@/infra/database/mappers/prisma-order-aggregate-mapper";
import { PrismaCatalogAggregateMapper } from "@/infra/database/mappers/prisma-catalog-aggregate-mapper";

export class PrismaBoxMergeMapper {
  static toDomain(
    raw: Prisma.BoxGetPayload<{
      include: {
        catalog: { include: { farm: { include: { admin: true } } } };
        orders: { include: { offer: { include: { product: true } } } };
      };
    }>
  ) {
    return BoxMerge.create({
      ...raw,
      id: new UUID(raw.id),
      catalog: PrismaCatalogAggregateMapper.toDomain(raw.catalog),
      orders: raw.orders.map((order) =>
        PrismaOrderAggregateMapper.toDomain(order)
      ),
    });
  }
}
