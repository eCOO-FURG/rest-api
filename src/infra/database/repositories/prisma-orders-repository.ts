// Entities
import { Order } from "@/core/entities/order";
import { OrderWithOffer } from "@/core/entities/value-objects/order-with-offer";

// Repositories
import {
  OrdersRepository,
  OrdersRepositoryFindManyByFarmIdInCycle,
} from "@/core/repositories/orders-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaOrderMapper } from "@/infra/database/mappers/prisma-order-mapper";
import { PrismaOrderWithOfferMapper } from "@/infra/database/mappers/prisma-order-with-offer-mapper";

export class PrismaOrdersRepository implements OrdersRepository {
  async findByOfferIdAndUserId(
    offer_id: string,
    user_id: string
  ): Promise<Order | null> {
    const order = await prisma.order.findFirst({
      where: {
        offer_id,
        user_id,
      },
    });

    if (!order) return null;

    return PrismaOrderMapper.toDomain(order);
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

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await prisma.$transaction([
      prisma.order.create({ data }),
      prisma.offer.update({
        where: {
          id: order.offer_id.value,
        },
        data: {
          amount: {
            decrement: order.amount
          }
        }
      })
    ])
  }

  async updateMany(orders: Order[]): Promise<void> {
    const data = orders.map((order) => PrismaOrderMapper.toPrisma(order));

    for (const item of data) {
      await prisma.order.update({
        where: {
          id: item.id,
        },
        data: item
      })
    }

    // to-do: update many raw query
  }
}
