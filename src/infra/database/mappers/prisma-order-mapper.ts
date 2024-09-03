// Entities
import { Order } from "@/core/entities/order";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libs
import { Prisma, Order as PrismaOrder } from "@prisma/client";

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder) {
    return Order.create({
      ...raw,
      id: new UUID(raw.id),
      offer_id: new UUID(raw.offer_id),
      bag_id: new UUID(raw.bag_id),
      box_id: new UUID(raw.box_id),
      amount: raw.amount.toNumber(),
    });
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      ...order.props,
      id: order.id.value,
      bag_id: order.bag_id.value,
      offer_id: order.offer_id.value,
      box_id: order.box_id.value,
    };
  }
}
