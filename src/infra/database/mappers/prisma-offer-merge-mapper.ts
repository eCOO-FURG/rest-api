// Entities
import { OfferMerge } from "@/core/entities/merged/offer-merge";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { Prisma } from "@prisma/client";

// Mappers
import { PrismaProductMapper } from "@/infra/database/mappers/prisma-product-mapper";
import { PrismaCatalogAggregateMapper } from "@/infra/database/mappers/prisma-catalog-aggregate-mapper";

export class PrismaOfferMergeMapper {
  static toDomain(
    raw: Prisma.OfferGetPayload<{
      include: {
        product: true;
        catalog: { include: { farm: { include: { admin: true } } } };
      };
    }>
  ) {
    return OfferMerge.create({
      ...raw,
      id: new UUID(raw.id),
      product: PrismaProductMapper.toDomain(raw.product),
      catalog: PrismaCatalogAggregateMapper.toDomain(raw.catalog),
      price: raw.price.toNumber(),
      amount: raw.amount.toNumber(),
    });
  }
}
