// Entities
import { Box } from "@/core/entities/box";

// Repositories
import {
  BoxesRepository,
  BoxesRepositorySearchRequest,
  BoxRepositoryReturnType,
  BoxEntityOf,
} from "@/core/repositories/boxes-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaBoxMapper } from "@/infra/database/mappers/prisma-box-mapper";
import { PrismaOrderMapper } from "@/infra/database/mappers/prisma-order-mapper";
import { PrismaBoxAndOrdersMapper } from "@/infra/database/mappers/prisma-box-and-orders-mapper";
import { PrismaBoxAndOrders } from "@/infra/database/mappers/prisma-box-and-orders-mapper";
import {
  PrismaBoxAndFarm,
  PrismaBoxAndFarmMapper,
} from "@/infra/database/mappers/prisma-box-and-farm-mapper";

export class PrismaBoxesRepository implements BoxesRepository {
  async find<T extends BoxRepositoryReturnType>(
    type: T,
    { id, status, cycle, farm, orders, since, before }: BoxesRepositorySearchRequest,
  ): Promise<BoxEntityOf<T> | null> {
    const box = await prisma.box.findFirst({
      where: {
        id,
        status,
        cycle: { id: cycle?.id },
        farm: {
          id: farm?.id,
          name: { contains: farm?.name, mode: "insensitive" },
        },
        created_at: { gte: since, lte: before },
      },
      include: {
        ...(type === "box-and-farm" && { farm: { include: { admin: true } } }),
        ...(type === "box-and-orders" && {
          farm: { include: { admin: true } },
          orders: {
            include: { offer: { include: { product: true } } },
            orderBy: { offer: { product: { name: "asc" } } },
            ...(orders?.page && {
              skip: (orders.page - 1) * 20,
              take: 20,
            }),
          },
        }),
      },
    });

    if (!box) {
      return null;
    }

    switch (type) {
      default:
        return PrismaBoxMapper.toDomain<T>(box);
      case "box-and-farm":
        // @ts-expect-error Prisma cannot infer type here
        return PrismaBoxAndFarmMapper.toDomain<T>(box as PrismaBoxAndFarm);
      case "box-and-orders":
        return PrismaBoxAndOrdersMapper.toDomain<T>(box as PrismaBoxAndOrders);
    }
  }

  async list<T extends BoxRepositoryReturnType>(
    type: T,
    { id, status, cycle, farm, orders, since, before }: BoxesRepositorySearchRequest,
    page?: number,
  ): Promise<BoxEntityOf<T>[]> {
    const boxes = await prisma.box.findMany({
      where: {
        id,
        status,
        cycle: { id: cycle?.id },
        farm: {
          id: farm?.id,
          name: { contains: farm?.name, mode: "insensitive" },
        },
        created_at: { gte: since, lte: before },
      },
      include: {
        ...(type === "box-and-farm" && { farm: { include: { admin: true } } }),
        ...(type === "box-and-orders" && {
          farm: { include: { admin: true } },
          orders: {
            include: { offer: { include: { product: true } } },
            orderBy: { offer: { product: { name: "asc" } } },
            ...(orders?.page && {
              skip: (orders.page - 1) * 20,
              take: 20,
            }),
          },
        }),
      },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
      orderBy: {
        created_at: "asc",
      },
    });

    switch (type) {
      default:
        return boxes.map(PrismaBoxMapper.toDomain<T>);
      case "box-and-farm":
        return boxes.map((box) =>
          // @ts-expect-error Prisma cannot infer type here
          PrismaBoxAndFarmMapper.toDomain(box as PrismaBoxAndFarm),
        );
      case "box-and-orders":
        return boxes.map((box) => PrismaBoxAndOrdersMapper.toDomain(box as PrismaBoxAndOrders));
    }
  }

  async create(box: Box): Promise<void> {
    const data = PrismaBoxMapper.toPrisma(box);

    await prisma.$transaction(async (ctx) => {
      await ctx.box.create({ data });

      await ctx.order.createMany({
        data: box.orders.map(PrismaOrderMapper.toPrisma),
      });
    });
  }

  async update(box: Box): Promise<void> {
    await prisma.box.update({
      where: { id: box.id.value },
      data: PrismaBoxMapper.toPrisma(box),
    });
  }

  async count({
    id,
    since,
    farm,
    cycle,
    before,
    status,
  }: BoxesRepositorySearchRequest): Promise<number> {
    return await prisma.box.count({
      where: {
        id,
        status,
        cycle: { id: cycle?.id },
        farm: {
          id: farm?.id,
          name: { contains: farm?.name, mode: "insensitive" },
        },
        created_at: { gte: since, lte: before },
      },
    });
  }
}
