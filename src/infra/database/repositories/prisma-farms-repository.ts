// Entities
import { Farm } from "@/core/entities/farm";

// Repositories
import {
  FarmsRepository,
  FarmsRepositorySearchRequest,
} from "@/core/repositories/farms-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaFarmMapper } from "@/infra/database/mappers/prisma-farm-mapper";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export class PrismaFarmsRepository implements FarmsRepository {
  async find(
    type: RepositoryResponse,
    { id, name, status, tally, admin }: FarmsRepositorySearchRequest
  ): Promise<Farm | null> {
    const farm = await prisma.farm.findFirst({
      where: { id, name, status, tally, admin },
      include: { admin: type !== "basic" },
    });

    if (!farm) return null;

    return PrismaFarmMapper.toDomain(farm);
  }
  async list(
    type: RepositoryResponse,
    { id, name, status, tally, admin }: FarmsRepositorySearchRequest,
    page?: number
  ): Promise<Farm[]> {
    const farms = await prisma.farm.findMany({
      where: {
        id,
        status,
        tally,
        admin,
        ...(name && { name: { contains: name, mode: "insensitive" } }),
      },
      include: { admin: type !== "basic" },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    return farms.map(PrismaFarmMapper.toDomain);
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
          roles: { push: "PRODUCER" },
        },
      });
    });
  }

  async update(farm: Farm): Promise<void> {
    const { admin_id, ...data } = PrismaFarmMapper.toPrisma(farm);

    await prisma.farm.update({
      where: { id: farm.id.value },
      data: {
        ...data,
        admin: { connect: { id: admin_id } },
      },
    });
  }

  async count({
    status,
    admin,
    id,
    name,
    tally,
  }: FarmsRepositorySearchRequest): Promise<number> {
    return await prisma.farm.count({
      where: { id, status, admin, name, tally },
    });
  }
}
