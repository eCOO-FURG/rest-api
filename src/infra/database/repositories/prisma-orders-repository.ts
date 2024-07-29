// Entities
import { Order } from "@/core/entities/order";
import { OrderWithOffer } from "@/core/entities/value-objects/order-with-offer";

// Repositories
import {
  OrdersRepository,
  OrdersRepositoryFindManyByFarmIdInCycle,
  OrdersRepositoryManyResponse,
} from "@/core/repositories/orders-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaOrderMapper } from "@/infra/database/mappers/prisma-order-mapper";
import { PrismaOrderWithOfferMapper } from "@/infra/database/mappers/prisma-order-with-offer-mapper";
import { RepositoryResponse } from "@/core/types/repository-response";

export class PrismaOrdersRepository implements OrdersRepository {
  async findManyByOfferIdAndUserId(
    offers_id: string[],
    user_id: string
  ): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: {
        offer_id: {
          in: offers_id,
        },
        user_id,
      },
    });

    // to-do: fix return

    return orders.map((order) => PrismaOrderMapper.toDomain(order));
  }

  async findManyWithOfferByOffersIds(
    offers_ids: string[]
  ): Promise<OrderWithOffer[]> {
    const orders = await prisma.order.findMany({
      where: {
        offer_id: {
          in: offers_ids,
        },
      },
      include: {
        offer: {
          include: {
            product: true,
          },
        },
      },
    });

    return orders.map((order) => PrismaOrderWithOfferMapper.toDomain(order));
  }

  async findManyByFarmIdInCycle({
    farm_id,
    cycle_id,
    created_at,
  }: OrdersRepositoryFindManyByFarmIdInCycle): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: {
        offer: {
          farm_id,
          cycle_id,
          created_at: {
            gte: created_at,
          },
        },
      },
    });

    return orders.map((order) => PrismaOrderMapper.toDomain(order));
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

  async findManyByBagId<T extends RepositoryResponse = "entity">(
    bag_id: string,
    type = "entity"
  ): Promise<OrdersRepositoryManyResponse<T>> {
    if (type === "entity") {
      const found = await prisma.order.findMany({ where: { bag_id } });

      return found.map((order) =>
        PrismaOrderMapper.toDomain(order)
      ) as OrdersRepositoryManyResponse<T>;
    }

    const found = await prisma.order.findMany({
      where: { bag_id },
      include: { offer: { include: { product: true } } },
    });

    return found.map((order) =>
      PrismaOrderWithOfferMapper.toDomain(order)
    ) as unknown as OrdersRepositoryManyResponse<T>;

    // to-do: fix mapper type
  }
}
