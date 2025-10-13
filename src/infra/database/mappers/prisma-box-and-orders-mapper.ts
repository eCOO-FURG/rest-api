// Entities
import { BoxAndOrders } from "@/core/entities/aggregates/box-and-orders";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { Box as PrismaBox } from "@prisma/client";

// Repositories
import { BoxRepositoryReturnType, BoxEntityOf } from "@/core/repositories/boxes-repository";

// Mappers
import {
  PrismaOrderAndOfferMapper,
  PrismaOrderAndOffer,
} from "@/infra/database/mappers/prisma-order-and-offer-mapper";
import {
  PrismaFarmAndAdmin,
  PrismaFarmAndAdminMapper,
} from "@/infra/database/mappers/prisma-farm-and-admin-mapper";

export type PrismaBoxAndOrders = PrismaBox & {
  orders: PrismaOrderAndOffer[];
  farm: PrismaFarmAndAdmin;
};

export class PrismaBoxAndOrdersMapper {
  static toDomain<T extends BoxRepositoryReturnType = "box-and-orders">(
    raw: PrismaBoxAndOrders,
  ): BoxEntityOf<T> {
    return BoxAndOrders.create({
      id: new UUID(raw.id),
      status: raw.status,
      cycle_id: new UUID(raw.cycle_id),
      farm_id: new UUID(raw.farm_id),
      farm: PrismaFarmAndAdminMapper.toDomain(raw.farm),
      orders: raw.orders.map(PrismaOrderAndOfferMapper.toDomain),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as BoxEntityOf<T>;
  }
}
