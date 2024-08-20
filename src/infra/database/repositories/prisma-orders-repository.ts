// Entities
import { Order } from "@/core/entities/order";

// Repositories
import {
  OrdersRepository,
  OrdersRepositoryResponse,
  OrdersRepositorySearchManyRequest,
} from "@/core/repositories/orders-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaOrderMapper } from "@/infra/database/mappers/prisma-order-mapper";
import { PrismaOrderAggregateMapper } from "@/infra/database/mappers/prisma-order-aggregate-mapper";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Libs
import { Prisma } from "@prisma/client";

export class PrismaOrdersRepository implements OrdersRepository {
  async searchMany<T extends RepositoryResponse = "entity">(
    { bag_id, offer, offers_ids, since }: OrdersRepositorySearchManyRequest,
    type: T
  ): Promise<OrdersRepositoryResponse<T>[]> {
    const where: Prisma.OrderWhereInput = {
      bag_id,
      ...(since && { created_at: { gte: since } }),
      ...(offer && { offer: { ...offer } }),
      ...(offers_ids && { offer_id: { in: offers_ids } }),
    };

    if (type === "entity") {
      const orders = await prisma.order.findMany({ where });

      return orders.map((order) =>
        PrismaOrderMapper.toDomain(order)
      ) as OrdersRepositoryResponse<T>[];
    }

    const orders = await prisma.order.findMany({
      where,
      include: { offer: { include: { product: true } } },
    });

    return orders.map((order) =>
      PrismaOrderAggregateMapper.toDomain(order)
    ) as OrdersRepositoryResponse<T>[];
  }

  async createMany(orders: Order[]): Promise<void> {
    const transactions = orders
      .map((order) => {
        const data = PrismaOrderMapper.toPrisma(order);

        return [
          prisma.order.create({ data }),
          prisma.offer.update({
            where: {
              id: order.offer_id.value,
            },
            data: {
              amount: {
                decrement: order.amount,
              },
            },
          }),
        ];
      })
      .flat();

    await prisma.$transaction(transactions);
  }

  async updateMany(orders: Order[]): Promise<void> {
    const data = orders.map((order) => PrismaOrderMapper.toPrisma(order));

    for (const item of data) {
      await prisma.order.update({
        where: {
          id: item.id,
        },
        data: item,
      });
    }

    // to-do: update many raw query
  }
}
