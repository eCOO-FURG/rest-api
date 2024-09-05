// Entities
import { CatalogAggregate } from "@/core/entities/aggregates/catalog-aggregate";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { Prisma } from "@prisma/client";
import { PrismaFarmAggregateMapper } from "@/infra/database/mappers/prisma-farm-aggregate-mapper";

export class PrismaCatalogAggregateMapper {
  static toDomain(
    raw: Prisma.CatalogGetPayload<{
      include: { farm: { include: { admin: true } } };
    }>
  ) {
    return CatalogAggregate.create({
      id: new UUID(raw.id),
      farm: PrismaFarmAggregateMapper.toDomain(raw.farm),
      cycle_id: new UUID(raw.cycle_id),
    });
  }
}
