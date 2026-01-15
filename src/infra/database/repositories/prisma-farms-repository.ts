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
import { PrismaProducerMapper } from "@/infra/database/mappers/prisma-producer-mapper";
import { PrismaCatalog, PrismaCatalogMapper } from "@/infra/database/mappers/prisma-catalog-mapper";

// Utils
import { now } from "@/core/utils/now";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";

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
        admin: type === "producer",
        ...(type === "catalog" && {
          admin: true,
          offers: {
            include: { product: true },
            where: {
              cycle_id: offers?.cycle?.id,
              market_id: offers?.market?.id,
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
              ...(offers?.available === "CYCLE" && {
                AND: [
                  {
                    opens_at: { not: { gt: now() } },
                  },
                  {
                    OR: [{ closes_at: null }, { closes_at: { gt: now() } }],
                  },
                  {
                    OR: [{ expires_at: null }, { expires_at: { gte: now() } }],
                  },
                  {
                    active: true,
                    amount: { gt: 0 },
                  },
                ],
              }),
              ...(offers?.available === "MARKET" && {
                AND: [
                  {
                    opens_at: { not: { gt: now() } },
                  },
                  {
                    OR: [{ expires_at: null }, { expires_at: { gte: now() } }],
                  },
                  {
                    active: true,
                    amount: { gt: 0 },
                  },
                ],
              }),
              ...(offers?.available === false && {
                OR: [
                  { closes_at: { not: null, lte: now() } },
                  { expires_at: { not: null, lte: now() } },
                  { active: false },
                  { amount: 0 },
                ],
              }),
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
      case "producer":
        return PrismaProducerMapper.toDomain<T>(farm);
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
          ...(offers && {
            some: {
              cycle_id: offers?.cycle?.id,
              market_id: offers?.market?.id,
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
              ...(offers.available === "CYCLE" && {
                AND: [
                  {
                    opens_at: { not: { gt: now() } },
                  },
                  {
                    OR: [{ closes_at: null }, { closes_at: { gt: now() } }],
                  },
                  {
                    OR: [{ expires_at: null }, { expires_at: { gte: now() } }],
                  },
                  {
                    active: true,
                    amount: { gt: 0 },
                  },
                ],
              }),
              ...(offers.available === "MARKET" && {
                AND: [
                  {
                    opens_at: { not: { gt: now() } },
                  },
                  {
                    OR: [{ expires_at: null }, { expires_at: { gte: now() } }],
                  },
                  {
                    active: true,
                    amount: { gt: 0 },
                  },
                ],
              }),
              ...(offers?.available === false && {
                OR: [
                  { closes_at: { not: null, lte: now() } },
                  { expires_at: { not: null, lte: now() } },
                  { active: false },
                  { amount: 0 },
                ],
              }),
              created_at: {
                gte: offers?.since,
                lte: offers?.before,
              },
            },
          }),
        },
      },
      include: {
        admin: type === "producer",
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
      case "producer":
        return farms.map(PrismaProducerMapper.toDomain<T>);
      case "catalog":
        return farms.map((farm) => PrismaCatalogMapper.toDomain(farm as PrismaCatalog));
    }
  }

  async create(farm: Farm): Promise<void> {
    await prisma.$transaction(async (ctx) => {
      if (farm.admin) {
        const admin = PrismaUserMapper.toPrisma(farm.admin);

        await ctx.user.upsert({
          where: { id: farm.admin.id.value },
          create: admin,
          update: admin,
        });
      }

      await ctx.farm.create({ data: PrismaFarmMapper.toPrisma(farm) });
    });
  }

  async update(farm: Farm): Promise<void> {
    await prisma.$transaction(async (ctx) => {
      if (farm.admin) {
        const admin = PrismaUserMapper.toPrisma(farm.admin);

        await ctx.user.upsert({
          where: { id: farm.admin.id.value },
          create: admin,
          update: admin,
        });
      }

      await ctx.farm.update({
        where: { id: farm.id.value },
        data: PrismaFarmMapper.toPrisma(farm),
      });
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
