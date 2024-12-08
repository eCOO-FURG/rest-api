// Entities
import { Bag } from "@/core/entities/bag";

// Repositories
import {
  BagsRepository,
  BagsRepositorySearchRequest,
} from "@/core/repositories/bags-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Mappers
import { PrismaBagMapper } from "@/infra/database/mappers/prisma-bag-mapper";
import { PrismaOrderMapper } from "@/infra/database/mappers/prisma-order-mapper";

// Utils
import { equals } from "@/infra/utils/equals";

export class PrismaBagsRepository implements BagsRepository {
  async find(
    type: RepositoryResponse,
    {
      id,
      statuses,
      cycle,
      user,
      address,
      orders,
      payments,
      before,
      since,
    }: BagsRepositorySearchRequest
  ): Promise<Bag | null> {
    const bag = await prisma.bag.findFirst({
      where: {
        id,
        status: { in: statuses },
        cycle,
        customer: user,
        address,
        created_at: { lte: before, gte: since },
      },
      include: {
        ...(type !== "basic" && {
          customer: true,
          address: true,
        }),
        ...(type === "merge" && {
          orders: {
            include: {
              offer: {
                include: {
                  product: true,
                  catalog: { include: { farm: { include: { admin: true } } } },
                },
              },
            },
            ...(orders?.page && {
              skip: (orders.page - 1) * 20,
              take: 20,
            }),
          },
          payments: {
            ...(payments?.page && {
              skip: (payments.page - 1) * 20,
              take: 20,
            }),
          },
        }),
      },
    });

    if (!bag) return null;

    return PrismaBagMapper.toDomain(bag);
  }

  async list(
    type: RepositoryResponse,
    {
      id,
      address,
      cycle,
      user,
      statuses,
      orders,
      payments,
      since,
      before,
    }: BagsRepositorySearchRequest,
    page?: number
  ): Promise<Bag[]> {
    const bags = await prisma.bag.findMany({
      where: {
        id,
        status: { in: statuses },
        cycle,
        customer: user,
        address,
        created_at: { lte: before, gte: since },
      },
      include: {
        ...(type !== "basic" && {
          customer: true,
          address: true,
        }),
        ...(type === "merge" && {
          orders: {
            include: {
              offer: {
                include: {
                  product: true,
                  catalog: { include: { farm: { include: { admin: true } } } },
                },
              },
            },
            ...(orders?.page && {
              skip: (orders.page - 1) * 20,
              take: 20,
            }),
          },
          payments: {
            ...(payments?.page && {
              skip: (payments.page - 1) * 20,
              take: 20,
            }),
          },
        }),
      },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    return bags.map(PrismaBagMapper.toDomain);
  }

  async create(bag: Bag): Promise<void> {
    const data = PrismaBagMapper.toPrisma(bag);

    await prisma.$transaction(async (transaction) => {
      await transaction.bag.create({ data });

      const orders = Array.from(bag.orders.values()).map(
        PrismaOrderMapper.toPrisma
      );

      await transaction.order.createMany({ data: orders });

      for (const order of bag.orders.values()) {
        await transaction.offer.update({
          where: { id: order.offer_id.value },
          data: { amount: { decrement: order.amount } },
        });
      }
    });
  }

  async update(bag: Bag): Promise<void> {
    const data = PrismaBagMapper.toPrisma(bag);

    await prisma.$transaction(async (transaction) => {
      await transaction.bag.update({
        where: { id: bag.id.value },
        data,
      });

      const previous = await transaction.order.findMany({
        where: { bag_id: bag.id.value },
      });

      for (const order of bag.orders.values()) {
        const existed = previous.find((p) => order.id.equals(p.id));

        if (!existed) {
          await transaction.order.create({
            data: PrismaOrderMapper.toPrisma(order),
          });
          continue;
        }

        const diff = equals(PrismaOrderMapper.toDomain(existed), order);

        if (!diff) continue;

        await transaction.order.update({
          where: { id: order.id.value },
          data: PrismaOrderMapper.toPrisma(order),
        });
      }

      // await transaction.order.deleteMany({
      //   where: { bag_id: bag.id.value },
      // });

      // const orders = bag.orders.map(PrismaOrderMapper.toPrisma);

      // await transaction.order.createMany({ data: orders });

      // for (const order of bag.orders) {
      //   await transaction.offer.update({
      //     where: { id: order.offer_id.value },
      //     data: { amount: { decrement: order.amount } },
      //   });
      // }
    });
  }
}
