// Entities
import { BoxAggregate } from "@/core/entities/aggregates/box-aggregate";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { Prisma } from "@prisma/client";

// Mappers
import { PrismaCatalogAggregateMapper } from "@/infra/database/mappers/prisma-catalog-aggregate-mapper";

export class PrismaBoxAggregateMapper {
  static toDomain(
    raw: Prisma.BoxGetPayload<{
      include: { catalog: { include: { farm: { include: { admin: true } } } } };
    }>
  ) {
    return BoxAggregate.create({
      ...raw,
      id: new UUID(raw.id),
      catalog: PrismaCatalogAggregateMapper.toDomain(raw.catalog),
    });
  }
}
