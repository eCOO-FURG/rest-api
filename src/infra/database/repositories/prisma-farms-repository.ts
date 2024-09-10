// Entities
import { Farm } from "@/core/entities/farm";

// Repositories
import {
  FarmsRepository,
  FarmsRepositoryResponse,
  FarmsRepositorySearchManyRequest,
  FarmsRepositorySearchRequest,
} from "@/core/repositories/farms-repository";
import { prisma } from "@/infra/database/prisma-service";
import { PrismaFarmMapper } from "@/infra/database/mappers/prisma-farm-mapper";
import { RepositoryResponse } from "@/core/types/repository-response";
import { PrismaFarmAggregateMapper } from "@/infra/database/mappers/prisma-farm-aggregate-mapper";

// Libs
import { Prisma } from "@prisma/client";

export class PrismaFarmsRepository implements FarmsRepository {
  async search<T extends RepositoryResponse>(
    filters: FarmsRepositorySearchRequest,
    type: T
  ): Promise<FarmsRepositoryResponse<T> | null> {
    const found = await prisma.farm.findFirst({
      where: filters,
      include: {
        admin: type === "aggregate",
      },
    });

    if (!found) return null;

    if (type === "entity")
      return PrismaFarmMapper.toDomain(found) as FarmsRepositoryResponse<T>;

    return PrismaFarmAggregateMapper.toDomain(
      found
    ) as FarmsRepositoryResponse<T>;
  }

  async searchMany<T extends RepositoryResponse>(
    { page, name }: FarmsRepositorySearchManyRequest,
    type: T
  ): Promise<FarmsRepositoryResponse<T>[]> {
    const query: Prisma.FarmFindManyArgs = {
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      skip: (page - 1) * 20,
      take: 20,
      orderBy: {
        name: "asc",
      },
    };

    if (type === "entity") {
      const farms = await prisma.farm.findMany(query);
      return farms.map((farm) =>
        PrismaFarmMapper.toDomain(farm)
      ) as FarmsRepositoryResponse<T>[];
    }

    const farms = await prisma.farm.findMany({
      ...query,
      include: {
        admin: true,
      },
    });

    return farms.map((farm) =>
      PrismaFarmAggregateMapper.toDomain(farm)
    ) as FarmsRepositoryResponse<T>[];
  }

  async create(farm: Farm): Promise<void> {
    const data = PrismaFarmMapper.toPrisma(farm);

    await prisma.$transaction(async (ctx) => {
      await ctx.farm.create({ data });

      await ctx.user.update({
        where: {
          id: farm.admin_id.value,
        },
        data: {
          roles: {
            push: "PRODUCER",
          },
        },
      });
    });
  }

  async update(farm: Farm): Promise<void> {
    const data = PrismaFarmMapper.toPrisma(farm);

    await prisma.user.update({
      where: {
        id: farm.id.value,
      },
      data,
    });
  }
}
