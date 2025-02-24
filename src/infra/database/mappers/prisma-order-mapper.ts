// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Order } from "@/core/entities/order";

// Libraries
import { Prisma } from "@prisma/client";

// Mappers
import { PrismaOfferMapper } from "@/infra/database/mappers/prisma-offer-mapper";

type PrismaOrder = Prisma.OrderGetPayload<{}> & {
  offer?: Prisma.OfferGetPayload<{}>;
};

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create({
      id: new UUID(raw.id),
      amount: raw.amount,
      price: raw.price.toNumber(),
      status: raw.status,
      box_id: new UUID(raw.box_id),
      bag_id: new UUID(raw.bag_id),
      offer_id: new UUID(raw.offer_id),
      ...(raw.offer && { offer: PrismaOfferMapper.toDomain(raw.offer) }),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.value,
      amount: order.amount,
      price: order.price,
      status: order.status,
      bag_id: order.bag_id.value,
      offer_id: order.offer_id.value,
      box_id: order.box_id.value,
      created_at: order.created_at,
      updated_at: order.updated_at,
    };
  }
}
