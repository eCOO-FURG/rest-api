// Entities
import { OfferAggregate } from "@/core/entities/aggregates/offer-aggregate";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libs
import { Prisma } from "@prisma/client";

// Mappers
import { PrismaProductMapper } from "@/infra/database/mappers/prisma-product-mapper";

export class PrismaOfferAggregateMapper {
  static toDomain(raw: Prisma.OfferGetPayload<{ include: { product: true } }>) {
    return OfferAggregate.create({
      ...raw,
      id: new UUID(raw.id),
      price: raw.price.toNumber(),
      amount: raw.amount.toNumber(),
      catalog_id: new UUID(raw.catalog_id),
      product: PrismaProductMapper.toDomain(raw.product),
    });
  }
}
