// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Order } from "@/core/entities/order";

// Libraries
import { Prisma, Order as PrismaOrder } from "@prisma/client";

// Repositories
import {
  OrderRepositoryReturnType,
  OrderEntityOf,
} from "@/core/repositories/orders-repository";

export class PrismaOrderMapper {
  static toDomain<T extends OrderRepositoryReturnType>(
    raw: PrismaOrder
  ): OrderEntityOf<T> {
    return Order.create({
      id: new UUID(raw.id),
      amount: raw.amount,
      price: raw.price.toNumber(),
      status: raw.status,
      box_id: new UUID(raw.box_id),
      bag_id: new UUID(raw.bag_id),
      offer_id: new UUID(raw.offer_id),
      fee: raw.fee.toNumber(),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as OrderEntityOf<T>;
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.value,
      amount: order.amount,
      price: order.price,
      status: order.status,
      fee: order.fee,
      bag_id: order.bag_id.value,
      offer_id: order.offer_id.value,
      box_id: order.box_id.value,
      created_at: order.created_at,
      updated_at: order.updated_at,
    };
  }
}
