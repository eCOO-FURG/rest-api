// Entities
import { Farm } from "@/core/entities/farm";

// Repositories
import {
  FarmsRepository,
  FarmsRepositoryResponse,
  FarmsRepositorySearchRequest,
} from "@/core/repositories/farms-repository";
import { prisma } from "@/infra/database/prisma-service";
import { PrismaFarmMapper } from "@/infra/database/mappers/prisma-farm-mapper";
import { RepositoryResponse } from "@/core/types/repository-response";
import { PrismaFarmAggregateMapper } from "@/infra/database/mappers/prisma-farm-aggregate-mapper";

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

  async searchMany<T extends RepositoryResponse = "entity">(
    { page, name }: { page: number; name?: string },
    type = "entity"
  ): Promise<FarmsRepositoryResponse<T>[]> {
    const skip = (page - 1) * 20;

    const where = {
      name: {
        contains: name,
      },
    };

    if (type === "entity") {
      const found = await prisma.farm.findMany({
        where,
        orderBy: {
          name: "asc",
        },
        skip,
        take: 20,
      });

      return found.map((farm) =>
        PrismaFarmMapper.toDomain(farm)
      ) as FarmsRepositoryResponse<T>[];
    }

    const found = await prisma.farm.findMany({
      where,
      include: {
        admin: true,
      },
      orderBy: {
        name: "asc",
      },
      skip,
      take: 20,
    });

    return found.map((farm) =>
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
