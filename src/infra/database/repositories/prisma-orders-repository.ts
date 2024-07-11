// Entities
import { Order } from "@/core/entities/order";
import { OrderWithOffer } from "@/core/entities/value-objects/order-with-offer";

// Repositories
import { OrdersRepository } from "@/core/repositories/orders-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaOrderMapper } from "@/infra/database/mappers/prisma-order-mapper";
import { PrismaOrderWithOfferMapper } from "@/infra/database/mappers/prisma-order-with-offer-mapper";

export class PismaOrdersRepository implements OrdersRepository {
  async findByOfferId(offer_id: string): Promise<Order | null> {
    const order = await prisma.order.findFirst({
      where: {
        offer_id,
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

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);
    await prisma.order.create({ data });
  }
}
