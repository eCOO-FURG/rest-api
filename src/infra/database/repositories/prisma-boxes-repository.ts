// Entities
import { Box } from "@/core/entities/box";

// Repositories
import {
  BoxesRepository,
  BoxesRepositorySearchRequest,
} from "@/core/repositories/boxes-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaBoxMapper } from "@/infra/database/mappers/prisma-box-mapper";
import { PrismaOrderMapper } from "@/infra/database/mappers/prisma-order-mapper";

export class PrismaBoxesRepository implements BoxesRepository {
  async find(
    type: RepositoryResponse,
    { id, status, catalog, orders, since, before }: BoxesRepositorySearchRequest
  ): Promise<Box | null> {
    const box = await prisma.box.findFirst({
      where: {
        id,
        status,
        catalog: {
          id: catalog?.id,
          cycle: { id: catalog?.cycle?.id },
          farm: {
            id: catalog?.farm?.id,
            name: { contains: catalog?.farm?.name, mode: "insensitive" },
          },
        },
        created_at: { gte: since, lte: before },
      },
      include: {
        ...(type !== "basic" && {
          catalog: { include: { farm: { include: { admin: true } } } },
        }),
        ...(type === "merge" && {
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

    if (!box) return null;

    return PrismaBoxMapper.toDomain(box);
  }

  async list(
    type: RepositoryResponse,
    {
      id,
      status,
      catalog,
      orders,
      since,
      before,
    }: BoxesRepositorySearchRequest,
    page?: number
  ): Promise<Box[]> {
    const boxes = await prisma.box.findMany({
      where: {
        id,
        status,
        catalog: {
          id: catalog?.id,
          cycle: { id: catalog?.cycle?.id },
          farm: {
            name: { contains: catalog?.farm?.name, mode: "insensitive" },
          },
        },
        created_at: { gte: since, lte: before },
      },
      include: {
        ...(type !== "basic" && {
          catalog: { include: { farm: { include: { admin: true } } } },
        }),
        ...(type === "merge" && {
          orders: {
            include: { offer: { include: { product: true } } },
            orderBy: { created_at: "asc" },
            ...(orders?.page && {
              skip: (orders.page - 1) * 20,
              take: 20,
            }),
          },
        }),
      },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    return boxes.map(PrismaBoxMapper.toDomain);
  }

  async create(box: Box): Promise<void> {
    const data = PrismaBoxMapper.toPrisma(box);

    await prisma.$transaction(async (ctx) => {
      await ctx.box.create({ data });

      const orders = Array.from(box.orders.values()).map(
        PrismaOrderMapper.toPrisma
      );

      await ctx.order.createMany({ data: orders });
    });
  }

  async update(box: Box): Promise<void> {
    const data = PrismaBoxMapper.toPrisma(box);

    await prisma.$transaction(async (ctx) => {
      await ctx.box.update({ where: { id: box.id.value }, data });

      const previous = await ctx.order.findMany({
        where: { box_id: box.id.value },
      });

      const created = [];

      for (const order of box.orders.values()) {
        const existed = previous.find((p) => order.id.equals(p.id));

        if (!existed) {
          created.push(order);
          continue;
        }

        if (existed.updated_at === order.updated_at) continue;

        await ctx.order.update({
          where: { id: order.id.value },
          data: PrismaOrderMapper.toPrisma(order),
        });
      }

      await ctx.order.createMany({
        data: created.map(PrismaOrderMapper.toPrisma),
      });

      const deletedIds = previous
        .filter((p) => !box.orders.has(p.id))
        .map((order) => order.id);

      if (deletedIds.length)
        await ctx.order.deleteMany({ where: { id: { in: deletedIds } } });
    });
  }

  async count({
    catalog,
    id,
    since,
    status,
  }: BoxesRepositorySearchRequest): Promise<number> {
    return await prisma.box.count({
      where: {
        catalog,
        id,
        created_at: { gte: since },
        status,
      },
    });
  }
}
