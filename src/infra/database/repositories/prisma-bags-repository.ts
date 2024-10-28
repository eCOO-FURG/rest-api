// Entities
import { Bag } from "@/core/entities/bag";

// Repositories
import {
  BagsRepository,
  BagsRepositoryResponse,
  BagsRepositorySearchManyRequest,
  BagsRepositorySearchRequest,
} from "@/core/repositories/bags-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Mappers
import { PrismaBagMapper } from "@/infra/database/mappers/prisma-bag-mapper";
import { PrismaBagAggregateMapper } from "@/infra/database/mappers/prisma-bag-aggregate-mapper";
import { PrismaBagMergeMapper } from "@/infra/database/mappers/prisma-bag-merge-mapper";

// Libs
import { Prisma } from "@prisma/client";

export class PrismaBagsRepository implements BagsRepository {
  async search<T extends RepositoryResponse = "entity">(
    { cycle, since, id, user }: BagsRepositorySearchRequest,
    type: T
  ): Promise<BagsRepositoryResponse<T> | null> {
    const where: Prisma.BagWhereInput = {
      id,
      cycle,
      customer: user,
    };

    if (since) Object.assign(where, { created_at: { gte: since } });

    if (type === "entity") {
      const found = await prisma.bag.findFirst({ where });

      if (!found) return null;

      return PrismaBagMapper.toDomain(found) as BagsRepositoryResponse<T>;
    }

    if (type === "aggregate") {
      const found = await prisma.bag.findFirst({
        where,
        include: { customer: true, address: true },
      });

      if (!found) return null;

      return PrismaBagAggregateMapper.toDomain(
        found
      ) as BagsRepositoryResponse<T>;
    }

    const found = await prisma.bag.findFirst({
      where,
      include: {
        customer: true,
        address: true,
        orders: {
          include: {
            offer: {
              include: {
                product: true,
                catalog: { include: { farm: { include: { admin: true } } } },
              },
            },
          },
        },
      },
    });

    if (!found) return null;

    return PrismaBagMergeMapper.toDomain(found) as BagsRepositoryResponse<T>;
  }

  async searchMany<T extends RepositoryResponse = "entity">(
    {
      page,
      cycle,
      since,
      before,
      status,
      user,
    }: BagsRepositorySearchManyRequest,
    type: T
  ): Promise<BagsRepositoryResponse<T>[]> {
    const where: Prisma.BagWhereInput = {
      cycle,
      status,
      customer: {
        id: user?.id,
        OR: [
          {
            first_name: {
              contains: user?.name ?? "",
              mode: "insensitive",
            },
          },
          {
            last_name: {
              contains: user?.name ?? "",
              mode: "insensitive",
            },
          },
        ],
      },
    };

    if (since) Object.assign(where, { created_at: { gte: since } });
    if (before) Object.assign(where, { created_at: { lte: before } });

    const query: Prisma.BagFindManyArgs = {
      where,
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    };

    if (type === "entity") {
      const found = await prisma.bag.findMany(query);

      return found.map((bag) =>
        PrismaBagMapper.toDomain(bag)
      ) as BagsRepositoryResponse<T>[];
    }

    if (type === "aggregate") {
      const found = await prisma.bag.findMany({
        ...query,
        include: {
          customer: true,
          address: true,
        },
      });

      return found.map((bag) =>
        PrismaBagAggregateMapper.toDomain(bag)
      ) as BagsRepositoryResponse<T>[];
    }

    const found = await prisma.bag.findMany({
      ...query,
      include: {
        customer: true,
        address: true,
        orders: {
          include: {
            offer: {
              include: {
                product: true,
                catalog: { include: { farm: { include: { admin: true } } } },
              },
            },
          },
        },
      },
    });

    return found.map((bag) =>
      PrismaBagMergeMapper.toDomain(bag)
    ) as BagsRepositoryResponse<T>[];
  }

  async create(bag: Bag): Promise<void> {
    const data = PrismaBagMapper.toPrisma(bag);
    await prisma.bag.create({ data });
  }

  async update(bag: Bag): Promise<void> {
    const data = PrismaBagMapper.toPrisma(bag);
    await prisma.bag.update({ where: { id: bag.id.value }, data });
  }
}
