// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { OrderAndDetails } from "@/core/entities/aggregates/order-and-details";

// Libraries
import { Order as PrismaOrder } from "@prisma/client";

// Repositories
import {
  OrderRepositoryReturnType,
  OrderEntityOf,
} from "@/core/repositories/orders-repository";

// Mappers
import {
  PrismaOfferAndDetailsMapper,
  PrismaOfferAndDetails,
} from "@/infra/database/mappers/prisma-offer-and-details-mapper";

export type PrismaOrderAndDetails = PrismaOrder & {
  offer: PrismaOfferAndDetails;
};

export class PrismaOrderAndDetailsMapper {
  static toDomain<T extends OrderRepositoryReturnType = "order-and-details">(
    raw: PrismaOrderAndDetails
  ): OrderEntityOf<T> {
    return OrderAndDetails.create({
      id: new UUID(raw.id),
      offer_id: new UUID(raw.offer_id),
      offer: PrismaOfferAndDetailsMapper.toDomain(raw.offer),
      bag_id: new UUID(raw.bag_id),
      box_id: new UUID(raw.box_id),
      amount: raw.amount,
      price: raw.price.toNumber(),
      fee: raw.fee.toNumber(),
      status: raw.status,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as OrderEntityOf<T>;
  }
}
