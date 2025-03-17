// Entities
import { Order } from "@/core/entities/order";

// Repositories
import {
  OrdersRepository,
  OrdersRepositorySearchRequest,
} from "@/core/repositories/orders-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaOrderMapper } from "@/infra/database/mappers/prisma-order-mapper";

export class PrismaOrdersRepository implements OrdersRepository {
  async find(
    type: RepositoryResponse,
    { id, bag, offer, since, before }: OrdersRepositorySearchRequest
  ): Promise<Order | null> {
    const order = await prisma.order.findUnique({
      where: {
        id,
        bag: { id: bag?.id },
        offer: { id: offer?.id },
        created_at: { gte: since, lte: before },
      },
    });

    if (!order) return null;

    return PrismaOrderMapper.toDomain(order);
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
