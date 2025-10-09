// Entities
import { BoxAndOrders } from "@/core/entities/aggregates/box-and-orders";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { Box as PrismaBox } from "@prisma/client";

// Repositories
import { BoxRepositoryReturnType, BoxEntityOf } from "@/core/repositories/boxes-repository";

// Mappers
import {
  PrismaCatalogAndFarmMapper,
  PrismaCatalogAndFarm,
} from "@/infra/database/mappers/prisma-catalog-and-farm-mapper";
import {
  PrismaOrderAndOfferMapper,
  PrismaOrderAndOffer,
} from "@/infra/database/mappers/prisma-order-and-offer-mapper";

export type PrismaBoxAndOrders = PrismaBox & {
  orders: PrismaOrderAndOffer[];
  catalog: PrismaCatalogAndFarm;
};

export class PrismaBoxAndOrdersMapper {
  static toDomain<T extends BoxRepositoryReturnType = "box-and-orders">(
    raw: PrismaBoxAndOrders,
  ): BoxEntityOf<T> {
    return BoxAndOrders.create({
      id: new UUID(raw.id),
      status: raw.status,
      catalog_id: new UUID(raw.catalog_id),
      catalog: PrismaCatalogAndFarmMapper.toDomain(raw.catalog),
      orders: raw.orders.map((order) => PrismaOrderAndOfferMapper.toDomain(order)),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as BoxEntityOf<T>;
  }
}
