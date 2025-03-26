// Entities
import { Order } from "@/core/entities/order";

// Repositories
import {
  OrdersRepository,
  OrdersRepositorySearchRequest,
  OrderRepositoryReturnType,
  OrderEntityOf,
} from "@/core/repositories/orders-repository";

// Database
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaOrderMapper } from "@/infra/database/mappers/prisma-order-mapper";
import {
  PrismaOrderAndOffer,
  PrismaOrderAndOfferMapper,
} from "@/infra/database/mappers/prisma-order-and-offer-mapper";

export class PrismaOrdersRepository implements OrdersRepository {
  async find<T extends OrderRepositoryReturnType>(
    type: T,
    { id, bag, offer, since, before }: OrdersRepositorySearchRequest
  ): Promise<OrderEntityOf<T> | null> {
    const order = await prisma.order.findUnique({
      where: {
        id,
        bag: { id: bag?.id },
        offer: { id: offer?.id },
        created_at: { gte: since, lte: before },
      },
      include: {
        ...(type === "order-and-offer" && {
          offer: { include: { product: true } },
        }),
      },
    });

    if (!order) return null;

    switch (type) {
      default:
        return PrismaOrderMapper.toDomain<T>(order);
      case "order-and-offer":
        return PrismaOrderAndOfferMapper.toDomain<T>(
          order as PrismaOrderAndOffer
        );
    }
  }

  async update(order: Order): Promise<void> {
    await prisma.$transaction(async (ctx) => {
      await ctx.order.update({
        where: { id: order.id.value },
        data: PrismaOrderMapper.toPrisma(order),
      });

      const bag = await ctx.bag.findFirstOrThrow({
        where: { id: order.bag_id.value },
        include: { orders: true },
      });

      const verified = bag.orders.every((order) => order.status !== "PENDING");

      if (verified) {
        await ctx.bag.update({
          where: { id: bag.id },
          data: { verified: true },
        });
      }
    });
  }
}
