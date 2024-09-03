// Entities
import { CatalogMerge } from "@/core/entities/merged/catalog-merge";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { Prisma } from "@prisma/client";

// Mappers
import { PrismaFarmAggregateMapper } from "@/infra/database/mappers/prisma-farm-aggregate-mapper";
import { PrismaOfferAggregateMapper } from "@/infra/database/mappers/prisma-offer-aggregate-mapper";

export class PrismaCatalogMergeMapper {
  static toDomain(
    raw: Prisma.CatalogGetPayload<{
      include: {
        farm: { include: { admin: true } };
        offers: { include: { product: true } };
      };
    }>
  ) {
    return CatalogMerge.create({
      id: new UUID(raw.id),
      farm: PrismaFarmAggregateMapper.toDomain(raw.farm),
      cycle_id: new UUID(raw.cycle_id),
      offers: raw.offers.map((offer) =>
        PrismaOfferAggregateMapper.toDomain(offer)
      ),
    });
  }
}
