// Entities
import { Order } from "@/core/entities/order";
import { UUID } from "@/core/entities/value-objects/uuid";

// Libs
import { Prisma, Order as PrismaOrder } from "@prisma/client";

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder) {
    return Order.create({
      ...raw,
      id: new UUID(raw.id),
      offer_id: new UUID(raw.offer_id),
      user_id: new UUID(raw.user_id),
      amount: raw.amount.toNumber(),
    });
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      ...order.props,
      id: order.id.value,
      offer_id: order.offer_id.value,
      user_id: order.user_id.value,
    };
  }
}
