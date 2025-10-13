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

// Utils
import { now } from "@/core/utils/now";

export class PrismaFarmsRepository implements FarmsRepository {
  async find<T extends FarmRepositoryReturnType>(
    type: T,
    { id, name, status, tally, admin, offers }: FarmsRepositorySearchRequest,
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
          offers: {
            include: { product: true },
            where: {
              ...(offers?.period?.since && {
                OR: [{ opens_at: { gte: offers.period.since } }, { closes_at: null }],
              }),
              ...(offers?.period?.before && {
                OR: [{ opens_at: { lte: offers.period.before } }, { closes_at: null }],
              }),
              product: {
                name: {
                  contains: offers?.product?.name,
                  mode: "insensitive",
                },
                category_id: offers?.product?.category?.id,
              },
              ...(typeof offers?.remaining === "boolean" &&
                (offers.remaining
                  ? {
                      amount: {
                        gt: 0,
                      },
                    }
                  : {
                      amount: {
                        equals: 0,
                      },
                    })),
              ...(typeof offers?.available === "boolean" &&
                (offers.available
                  ? {
                      AND: [
                        {
                          OR: [{ closes_at: null }, { closes_at: { gt: now() } }],
                        },
                        {
                          OR: [{ expires_at: null }, { expires_at: { gte: now() } }],
                        },
                        {
                          active: true,
                        },
                      ],
                    }
                  : {
                      OR: [
                        { closes_at: { not: null, lte: now() } },
                        { expires_at: { not: null, lte: now() } },
                        { active: false },
                      ],
                    })),
              created_at: {
                gte: offers?.since,
                lte: offers?.before,
              },
            },
            ...(offers?.page && {
              skip: (offers.page - 1) * 20,
              take: 20,
            }),
            orderBy: {
              product: {
                name: "asc",
              },
            },
          },
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
    { id, name, status, tally, admin, offers }: FarmsRepositorySearchRequest,
    page?: number,
  ): Promise<FarmEntityOf<T>[]> {
    const farms = await prisma.farm.findMany({
      where: {
        id,
        name: { contains: name, mode: "insensitive" },
        status,
        tally,
        admin,
        offers: {
          some: {
            ...(offers?.period?.since && {
              OR: [{ opens_at: { gte: offers.period.since } }, { closes_at: null }],
            }),
            ...(offers?.period?.before && {
              OR: [{ opens_at: { lte: offers.period.before } }, { closes_at: null }],
            }),
            product: {
              name: { contains: offers?.product?.name, mode: "insensitive" },
              category_id: offers?.product?.category?.id,
            },
            ...(typeof offers?.remaining === "boolean" &&
              (offers.remaining
                ? {
                    amount: {
                      gt: 0,
                    },
                  }
                : {
                    amount: {
                      equals: 0,
                    },
                  })),
            ...(typeof offers?.available === "boolean" &&
              (offers.available
                ? {
                    AND: [
                      {
                        OR: [{ closes_at: null }, { closes_at: { gt: now() } }],
                      },
                      {
                        OR: [{ expires_at: null }, { expires_at: { gte: now() } }],
                      },
                      {
                        active: true,
                      },
                    ],
                  }
                : {
                    OR: [
                      { closes_at: { not: null, lte: now() } },
                      { expires_at: { not: null, lte: now() } },
                      { active: false },
                    ],
                  })),

            created_at: {
              gte: offers?.since,
              lte: offers?.before,
            },
          },
        },
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
