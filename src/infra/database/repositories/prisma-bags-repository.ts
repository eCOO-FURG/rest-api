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
import { PrismaAddressMapper } from "@/infra/database/mappers/prisma-address-mapper";
import { PrismaBagMapper } from "@/infra/database/mappers/prisma-bag-mapper";
import { PrismaOrderMapper } from "@/infra/database/mappers/prisma-order-mapper";

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
      withdraw,
      before,
      since,
    }: BagsRepositorySearchRequest
  ): Promise<Bag | null> {
    const bag = await prisma.bag.findFirst({
      where: {
        id,
        status: { in: statuses },
        cycle,
        address,
        customer: {
          id: user?.id,
          ...(user?.name && {
            OR: [
              { first_name: { contains: user?.name, mode: "insensitive" } },
              { last_name: { contains: user?.name, mode: "insensitive" } },
            ],
          }),
        },
        ...(typeof withdraw === "boolean" &&
          (withdraw ? { address_id: null } : { address_id: { not: null } })),
        ...(since && {
          created_at: {
            gte: since,
          },
        }),
        ...(before && {
          created_at: {
            lte: before,
          },
        }),
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
                  catalog: { include: { farm: true } },
                },
              },
            },
            ...(orders?.page && {
              skip: (orders.page - 1) * 20,
              take: 20,
            }),
          },
          payments: {
            ...(payments && {
              where: {
                status: {
                  equals: payments.status,
                },
                method: {
                  equals: payments.method,
                },
              },
              ...(payments.page && {
                skip: (payments.page - 1) * 20,
                take: 20,
              }),
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
      withdraw,
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
        address,
        customer: {
          id: user?.id,
          ...(user?.name && {
            OR: [
              { first_name: { contains: user?.name, mode: "insensitive" } },
              { last_name: { contains: user?.name, mode: "insensitive" } },
            ],
          }),
        },
        ...(typeof withdraw === "boolean" &&
          (withdraw ? { address_id: null } : { address_id: { not: null } })),
        ...(since && {
          created_at: {
            gte: since,
          },
        }),
        ...(before && {
          created_at: {
            lte: before,
          },
        }),
        ...(payments && {
          payments: {
            some: {
              status: payments?.status,
              method: payments?.method,
            },
          },
        }),
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
            ...(payments && {
              where: {
                status: {
                  equals: payments.status,
                },
                method: {
                  equals: payments.method,
                },
              },
              ...(payments.page && {
                skip: (payments.page - 1) * 20,
                take: 20,
              }),
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

    await prisma.$transaction(async (ctx) => {
      if (bag.address_id && bag.address) {
        const address = await ctx.address.findFirst({
          where: { id: bag.address_id.value },
        });

        if (!address) {
          await ctx.address.create({
            data: { ...PrismaAddressMapper.toPrisma(bag.address) },
          });
        }
      }

      await ctx.bag.create({ data });

      const orders = Array.from(bag.orders.values()).map(
        PrismaOrderMapper.toPrisma
      );

      await ctx.order.createMany({ data: orders });

      for (const order of bag.orders.values()) {
        await ctx.offer.update({
          where: { id: order.offer_id.value },
          data: { amount: { decrement: order.amount } },
        });
      }
    });
  }

  async update(bag: Bag): Promise<void> {
    const data = PrismaBagMapper.toPrisma(bag);

    await prisma.$transaction(async (ctx) => {
      await ctx.bag.update({
        where: { id: bag.id.value },
        data,
      });

      const previousOrders = await ctx.order.findMany({
        where: { bag_id: bag.id.value },
      });

      const createdOrders = [];

      for (const order of bag.orders.values()) {
        const existed = previousOrders.find((p) => order.id.equals(p.id));

        if (!existed) {
          createdOrders.push(order);

          await ctx.offer.update({
            where: { id: order.offer_id.value },
            data: { amount: { decrement: order.amount } },
          });

          continue;
        }

        if (existed.updated_at === order.updated_at) continue;

        await ctx.order.update({
          where: { id: order.id.value },
          data: {
            ...PrismaOrderMapper.toPrisma(order),
          },
        });
      }

      await ctx.order.createMany({
        data: createdOrders.map(PrismaOrderMapper.toPrisma),
      });

      const deletedIds = previousOrders
        .filter((p) => !bag.orders.has(p.id))
        .map((order) => order.id);

      if (deletedIds.length)
        await ctx.order.deleteMany({ where: { id: { in: deletedIds } } });

      if (bag.status === "CANCELLED") {
        for (const order of bag.orders.values()) {
          await ctx.order.update({
            where: { id: order.id.value },
            data: {
              status: "CANCELLED",
              offer: { update: { amount: { increment: order.amount } } },
            },
          });
        }
      }
    });
  }
}
