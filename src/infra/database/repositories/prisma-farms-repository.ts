// Entities
import { Farm } from "@/core/entities/farm";

// Repositories
import {
  FarmRepositoryReturnType,
  FarmEntityOf,
  FarmsRepository,
  FarmsRepositorySearchRequest,
} from "@/core/repositories/farms-repository";

// Database
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaFarmMapper } from "@/infra/database/mappers/prisma-farm-mapper";
import { PrismaFarmAndAdminMapper } from "@/infra/database/mappers/prisma-farm-and-admin-mapper";
import { PrismaCatalog, PrismaCatalogMapper } from "@/infra/database/mappers/prisma-catalog-mapper";

export class PrismaFarmsRepository implements FarmsRepository {
  async find<T extends FarmRepositoryReturnType>(
    type: T,
    { id, name, status, tally, admin }: FarmsRepositorySearchRequest,
  ): Promise<FarmEntityOf<T> | null> {
    const farm = await prisma.farm.findFirst({
      where: {
        id,
        name: { contains: name, mode: "insensitive" },
        status,
        tally,
        admin,
      },
      include: {
        admin: type === "farm-and-admin",
        ...(type === "catalog" && {
          admin: true,
          offers: { include: { product: true } },
        }),
      },
    });

    if (!farm) {
      return null;
    }

    switch (type) {
      default:
        return PrismaFarmMapper.toDomain<T>(farm);
      case "farm-and-admin":
        return PrismaFarmAndAdminMapper.toDomain<T>(farm);
      case "catalog":
        return PrismaCatalogMapper.toDomain<T>(farm as PrismaCatalog);
    }
  }

  async list<T extends FarmRepositoryReturnType>(
    type: T,
    { id, name, status, tally, admin }: FarmsRepositorySearchRequest,
    page?: number,
  ): Promise<FarmEntityOf<T>[]> {
    const farms = await prisma.farm.findMany({
      where: {
        id,
        name: { contains: name, mode: "insensitive" },
        status,
        tally,
        admin,
      },
      include: {
        admin: type === "farm-and-admin",
        ...(type === "catalog" && {
          admin: true,
          offers: { include: { product: true } },
        }),
      },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    switch (type) {
      default:
        return farms.map(PrismaFarmMapper.toDomain<T>);
      case "farm-and-admin":
        return farms.map(PrismaFarmAndAdminMapper.toDomain<T>);
      case "catalog":
        return farms.map((farm) => PrismaCatalogMapper.toDomain(farm as PrismaCatalog));
    }
  }

  async create(farm: Farm): Promise<void> {
    const data = PrismaFarmMapper.toPrisma(farm);

    await prisma.$transaction(async (ctx) => {
      await ctx.farm.create({ data });

      if (farm.admin && !farm.admin.roles.includes("PRODUCER")) {
        await ctx.user.update({
          where: { id: farm.admin_id.value },
          data: { roles: { push: "PRODUCER" } },
        });
      }
    });
  }

  async update(farm: Farm): Promise<void> {
    await prisma.farm.update({
      where: { id: farm.id.value },
      data: PrismaFarmMapper.toPrisma(farm),
    });
  }

  async count({ id, name, status, tally, admin }: FarmsRepositorySearchRequest): Promise<number> {
    return await prisma.farm.count({
      where: {
        id,
        name: { contains: name, mode: "insensitive" },
        status,
        admin,
        tally,
      },
    });
  }
}
