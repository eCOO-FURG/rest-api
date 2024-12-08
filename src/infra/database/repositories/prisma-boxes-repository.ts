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

export class PrismaBoxesRepository implements BoxesRepository {
  async find(
    type: RepositoryResponse,
    { id, status, catalog, orders, since }: BoxesRepositorySearchRequest
  ): Promise<Box | null> {
    const box = await prisma.box.findUnique({
      where: { id, status, catalog, created_at: { gte: since } },
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
    });

    if (!box) return null;

    return PrismaBoxMapper.toDomain(box);
  }

  async list(
    type: RepositoryResponse,
    { id, status, catalog, orders, since }: BoxesRepositorySearchRequest,
    page?: number
  ): Promise<Box[]> {
    const boxes = await prisma.box.findMany({
      where: {
        id,
        status,
        catalog,
        created_at: { gte: since },
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
    await prisma.box.create({ data });
  }

  async update(box: Box): Promise<void> {
    const data = PrismaBoxMapper.toPrisma(box);
    await prisma.box.update({ where: { id: box.id.value }, data });
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
