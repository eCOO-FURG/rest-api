// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { OrderAndOffer } from "@/core/entities/aggregates/order-and-offer";

// Libraries
import { Order as PrismaOrder } from "@prisma/client";

// Repositories
import { OrderRepositoryReturnType, OrderEntityOf } from "@/core/repositories/orders-repository";

// Mappers
import {
  PrismaOfferAndProductMapper,
  PrismaOfferAndProduct,
} from "@/infra/database/mappers/prisma-offer-and-product-mapper";

export type PrismaOrderAndOffer = PrismaOrder & {
  offer: PrismaOfferAndProduct;
};

export class PrismaOrderAndOfferMapper {
  static toDomain<T extends OrderRepositoryReturnType = "order-and-offer">(
    raw: PrismaOrderAndOffer,
  ): OrderEntityOf<T> {
    return OrderAndOffer.create({
      id: new UUID(raw.id),
      offer_id: new UUID(raw.offer_id),
      offer: PrismaOfferAndProductMapper.toDomain(raw.offer),
      bag_id: new UUID(raw.bag_id),
      box_id: raw.box_id ? new UUID(raw.box_id) : null,
      amount: raw.amount,
      subtotal: raw.subtotal.toNumber(),
      fee: raw.fee.toNumber(),
      status: raw.status,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as OrderEntityOf<T>;
  }
}
