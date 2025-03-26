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
import {
  PrismaBoxAndCatalog,
  PrismaBoxAndCatalogMapper,
} from "@/infra/database/mappers/prisma-box-and-catalog-mapper";
import { PrismaBoxAndOrdersMapper } from "@/infra/database/mappers/prisma-box-and-orders-mapper";
import { PrismaBoxAndOrders } from "@/infra/database/mappers/prisma-box-and-orders-mapper";

export class PrismaBoxesRepository implements BoxesRepository {
  async find<T extends BoxRepositoryReturnType>(
    type: T,
    { id, status, catalog, orders, since, before }: BoxesRepositorySearchRequest
  ): Promise<BoxEntityOf<T> | null> {
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
      include:
        type === "box-and-catalog"
          ? { catalog: { include: { farm: { include: { admin: true } } } } }
          : type === "box-and-orders"
          ? {
              catalog: { include: { farm: { include: { admin: true } } } },
              orders: {
                include: { offer: { include: { product: true } } },
                orderBy: { created_at: "asc" },
                ...(orders?.page && {
                  skip: (orders.page - 1) * 20,
                  take: 20,
                }),
              },
            }
          : null,
    });

    if (!box) return null;

    switch (type) {
      default:
        return PrismaBoxMapper.toDomain<T>(box);
      case "box-and-catalog":
        return PrismaBoxAndCatalogMapper.toDomain<T>(
          box as PrismaBoxAndCatalog
        );
      case "box-and-orders":
        return PrismaBoxAndOrdersMapper.toDomain<T>(box as PrismaBoxAndOrders);
    }
  }

  async list<T extends BoxRepositoryReturnType>(
    type: T,
    {
      id,
      status,
      catalog,
      orders,
      since,
      before,
    }: BoxesRepositorySearchRequest,
    page?: number
  ): Promise<BoxEntityOf<T>[]> {
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
      include:
        type === "box-and-catalog"
          ? { catalog: { include: { farm: { include: { admin: true } } } } }
          : type === "box-and-orders"
          ? {
              catalog: { include: { farm: { include: { admin: true } } } },
              orders: {
                include: { offer: { include: { product: true } } },
                orderBy: { created_at: "asc" },
                ...(orders?.page && {
                  skip: (orders.page - 1) * 20,
                  take: 20,
                }),
              },
            }
          : null,
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    switch (type) {
      default:
        return boxes.map(PrismaBoxMapper.toDomain<T>);
      case "box-and-catalog":
        return boxes.map((box) =>
          PrismaBoxAndCatalogMapper.toDomain(box as PrismaBoxAndCatalog)
        );
      case "box-and-orders":
        return boxes.map((box) =>
          PrismaBoxAndOrdersMapper.toDomain(box as PrismaBoxAndOrders)
        );
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
