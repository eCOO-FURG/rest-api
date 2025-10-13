// Entities
import { Bag } from "@/core/entities/bag";

// Repositories
import {
  BagEntityOf,
  BagRepositoryReturnType,
  BagsRepository,
  BagsRepositorySearchRequest,
} from "@/core/repositories/bags-repository";

// Database
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaAddressMapper } from "@/infra/database/mappers/prisma-address-mapper";
import { PrismaBagAndDetailsMapper } from "@/infra/database/mappers/prisma-bag-and-details-mapper";
import {
  PrismaBagAndOrders,
  PrismaBagAndOrdersMapper,
} from "@/infra/database/mappers/prisma-bag-and-orders-mapper";
import { PrismaBagMapper } from "@/infra/database/mappers/prisma-bag-mapper";
import { PrismaBoxMapper } from "@/infra/database/mappers/prisma-box-mapper";
import { PrismaOrderMapper } from "@/infra/database/mappers/prisma-order-mapper";
export class PrismaBagsRepository implements BagsRepository {
  async find<T extends BagRepositoryReturnType>(
    type: T,
    {
      id,
      withdraw,
      statuses,
      user,
      cycle,
      address,
      orders,
      payment,
      since,
      before,
    }: BagsRepositorySearchRequest,
  ): Promise<BagEntityOf<T> | null> {
    const bag = await prisma.bag.findFirst({
      where: {
        id,
        status: { in: statuses },
        cycle,
        address,
        payment: {
          ...(payment?.status && { status: { in: payment.status } }),
          ...(payment?.method && { method: { in: payment.method } }),
        },
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
        created_at: {
          gte: since,
          lte: before,
        },
      },
      include: {
        customer: type !== "bag",
        address: type !== "bag",
        payment: type !== "bag",
        ...(type === "bag-and-orders" && {
          orders: {
            include: {
              offer: {
                include: {
                  product: true,
                  farm: { include: { admin: true } },
                },
              },
            },
            where: {
              id: orders?.id,
              ...(orders?.statuses && { status: { in: orders.statuses } }),
            },
            ...(orders?.page && {
              skip: (orders.page - 1) * 20,
              take: 20,
            }),
          },
        }),
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!bag) return null;

    switch (type) {
      default:
        return PrismaBagMapper.toDomain<T>(bag);
      case "bag-and-details":
        return PrismaBagAndDetailsMapper.toDomain<T>(bag);
      case "bag-and-orders":
        return PrismaBagAndOrdersMapper.toDomain<T>(bag as PrismaBagAndOrders);
    }
  }

  async list<T extends BagRepositoryReturnType>(
    type: T,
    {
      id,
      withdraw,
      statuses,
      user,
      cycle,
      address,
      orders,
      payment,
      since,
      before,
    }: BagsRepositorySearchRequest,
    page?: number,
  ): Promise<BagEntityOf<T>[]> {
    const bags = await prisma.bag.findMany({
      where: {
        id,
        status: { in: statuses },
        cycle,
        address,
        payment: {
          ...(payment?.status && { status: { in: payment.status } }),
          ...(payment?.method && { method: { in: payment.method } }),
        },
        customer: {
          id: user?.id,
          ...(user?.name && {
            OR: [
              { first_name: { contains: user?.name, mode: "insensitive" } },
              { last_name: { contains: user?.name, mode: "insensitive" } },
            ],
          }),
        },
        orders: {
          some: {
            id: orders?.id,
            ...(orders?.statuses && { status: { in: orders.statuses } }),
          },
        },
        ...(typeof withdraw === "boolean" &&
          (withdraw ? { address_id: null } : { address_id: { not: null } })),
        created_at: {
          gte: since,
          lte: before,
        },
      },
      include: {
        customer: type !== "bag",
        address: type !== "bag",
        payment: type !== "bag",
        ...(type === "bag-and-orders" && {
          orders: {
            include: {
              offer: {
                include: {
                  product: true,
                  farm: { include: { admin: true } },
                },
              },
            },
            ...(orders?.page && {
              skip: (orders.page - 1) * 20,
              take: 20,
            }),
          },
        }),
      },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
      orderBy: {
        created_at: "desc",
      },
    });

    switch (type) {
      default:
        return bags.map(PrismaBagMapper.toDomain<T>);
      case "bag-and-details":
        return bags.map(PrismaBagAndDetailsMapper.toDomain<T>);
      case "bag-and-orders":
        return bags.map((bag) => PrismaBagAndOrdersMapper.toDomain<T>(bag as PrismaBagAndOrders));
    }
  }

  async save(bag: Bag): Promise<void> {
    await prisma.$transaction(async (ctx) => {
      if (bag.address) {
        const address = await ctx.address.findFirst({
          where: { id: bag.address.id.value },
        });

        if (!address) {
          await ctx.address.create({
            data: PrismaAddressMapper.toPrisma(bag.address),
          });
        }
      }

      const data = PrismaBagMapper.toPrisma(bag);

      await ctx.bag.create({ data });

      for (const order of bag.orders.values()) {
        if (order.box) {
          const box = await ctx.box.findFirst({
            where: { id: order.box.id.value },
          });

          if (!box) {
            await ctx.box.create({
              data: PrismaBoxMapper.toPrisma(order.box),
            });
          }
        }

        await ctx.offer.update({
          where: { id: order.offer_id.value },
          data: { amount: { decrement: order.amount } },
        });
      }

      await ctx.order.createMany({
        data: bag.orders.map(PrismaOrderMapper.toPrisma),
      });

      if (bag.status === "CANCELLED") {
        const orders = await ctx.order.findMany({
          where: { bag_id: bag.id.value },
        });

        for (const order of orders) {
          if (order.status !== "CANCELLED") {
            await ctx.order.update({
              where: { id: order.id },
              data: { status: "CANCELLED" },
            });

            await ctx.offer.update({
              where: { id: order.offer_id },
              data: { amount: { increment: order.amount } },
            });
          }
        }
      }
    });
  }
}
