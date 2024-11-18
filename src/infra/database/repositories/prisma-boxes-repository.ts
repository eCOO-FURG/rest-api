// Entities
import { Box } from "@/core/entities/box";

// Repositories
import {
  BoxesRepository,
  BoxesRepositoryResponse,
  BoxesRepositorySearchManyRequest,
  BoxesRepositorySearchRequest,
} from "@/core/repositories/boxes-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Libs
import { Prisma } from "@prisma/client";

// Mappers
import { PrismaBoxMapper } from "@/infra/database/mappers/prisma-box-mapper";
import { PrismaBoxAggregateMapper } from "@/infra/database/mappers/prisma-box-aggregate-mapper";
import { PrismaBoxMergeMapper } from "@/infra/database/mappers/prisma-box-merge-mapper";

export class PrismaBoxesRepository implements BoxesRepository {
  async search<T extends RepositoryResponse>(
    filters: BoxesRepositorySearchRequest,
    type: T
  ): Promise<BoxesRepositoryResponse<T> | null> {
    const { since, ...data } = filters;

    const where: Prisma.BoxWhereInput = data;

    if (since) Object.assign(where, { created_at: { gte: since } });

    if (type === "entity") {
      const box = await prisma.box.findFirst({ where });

      if (!box) return null;

      return PrismaBoxMapper.toDomain(box) as BoxesRepositoryResponse<T>;
    }

    if (type === "aggregate") {
      const box = await prisma.box.findFirst({
        where,
        include: {
          catalog: { include: { farm: { include: { admin: true } } } },
        },
      });

      if (!box) return null;

      return PrismaBoxAggregateMapper.toDomain(
        box
      ) as BoxesRepositoryResponse<T>;
    }

    const box = await prisma.box.findFirst({
      where,
      include: {
        catalog: { include: { farm: { include: { admin: true } } } },
        orders: { include: { offer: { include: { product: true } } } },
      },
    });

    if (!box) return null;

    return PrismaBoxMergeMapper.toDomain(box) as BoxesRepositoryResponse<T>;
  }

  async searchMany<T extends RepositoryResponse>(
    { catalog, page }: BoxesRepositorySearchManyRequest,
    type: T
  ): Promise<BoxesRepositoryResponse<T>[]> {
    const query: Prisma.BoxFindManyArgs = {
      where: {
        catalog: {
          farm: {
            name: {
              contains: catalog?.farm?.name,
              mode: "insensitive",
            },
          },
          cycle: {
            id: catalog?.cycle?.id,
          },
        },
      },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    };

    if (type === "entity") {
      const boxes = await prisma.box.findMany(query);

      return boxes.map((box) =>
        PrismaBoxMapper.toDomain(box)
      ) as BoxesRepositoryResponse<T>[];
    }

    if (type === "aggregate") {
      const boxes = await prisma.box.findMany({
        ...query,
        include: {
          catalog: { include: { farm: { include: { admin: true } } } },
        },
      });

      return boxes.map((box) =>
        PrismaBoxAggregateMapper.toDomain(box)
      ) as BoxesRepositoryResponse<T>[];
    }

    const boxes = await prisma.box.findMany({
      ...query,
      include: {
        catalog: { include: { farm: { include: { admin: true } } } },
        orders: { include: { offer: { include: { product: true } } } },
      },
    });

    return boxes.map((box) =>
      PrismaBoxMergeMapper.toDomain(box)
    ) as BoxesRepositoryResponse<T>[];
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
