// Entities
import { Catalog } from "@/core/entities/catalog";

// Repositories
import {
  CatalogEntityOf,
  CatalogRepositoryReturnType,
  CatalogsRepository,
  CatalogsRepositorySearchRequest,
} from "@/core/repositories/catalogs-repository";

// Database
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import {
  PrismaCatalogAndFarm,
  PrismaCatalogAndFarmMapper,
} from "@/infra/database/mappers/prisma-catalog-and-farm-mapper";
import {
  PrismaCatalogAndOffers,
  PrismaCatalogAndOffersMapper,
} from "@/infra/database/mappers/prisma-catalog-and-offers-mapper";
import { PrismaCatalogMapper } from "@/infra/database/mappers/prisma-catalog-mapper";
import { PrismaOfferMapper } from "@/infra/database/mappers/prisma-offer-mapper";

export class PrismaCatalogsRepository implements CatalogsRepository {
  async find<T extends CatalogRepositoryReturnType>(
    type: T,
    { id, since, before, farm, cycle, offers }: CatalogsRepositorySearchRequest
  ): Promise<CatalogEntityOf<T> | null> {
    const catalog = await prisma.catalog.findFirst({
      where: {
        id,
        farm: {
          id: farm?.id,
          name: { contains: farm?.name, mode: "insensitive" },
        },
        cycle: { id: cycle?.id },
        created_at: {
          gte: since,
          lte: before,
        },
      },
      include:
        type === "catalog-and-farm"
          ? { farm: { include: { admin: true } } }
          : type === "catalog-and-offers"
          ? {
              farm: { include: { admin: true } },
              offers: {
                include: { product: true },
                where: {
                  product: {
                    name: {
                      contains: offers?.product?.name,
                      mode: "insensitive",
                    },
                    category_id: offers?.product?.category?.id,
                  },
                  ...(typeof offers?.expired === "boolean" &&
                    (offers.expired
                      ? {
                          AND: [
                            { expires_at: { lte: new Date() } },
                            { expires_at: { not: null } },
                          ],
                        }
                      : {
                          OR: [
                            { expires_at: { gt: new Date() } },
                            { expires_at: null },
                          ],
                        })),
                },
                ...(offers?.page && { skip: (offers.page - 1) * 20, take: 20 }),
                orderBy: {
                  product: {
                    name: "asc",
                  },
                },
              },
            }
          : null,
    });

    if (!catalog) return null;

    switch (type) {
      default:
        return PrismaCatalogMapper.toDomain<T>(catalog);
      case "catalog-and-farm":
        return PrismaCatalogAndFarmMapper.toDomain<T>(
          catalog as PrismaCatalogAndFarm
        );
      case "catalog-and-offers":
        return PrismaCatalogAndOffersMapper.toDomain<T>(
          catalog as PrismaCatalogAndOffers
        );
    }
  }

  async list<T extends CatalogRepositoryReturnType>(
    type: T,
    { id, since, before, farm, cycle, offers }: CatalogsRepositorySearchRequest,
    page?: number
  ): Promise<CatalogEntityOf<T>[]> {
    const catalogs = await prisma.catalog.findMany({
      where: {
        id,
        created_at: {
          gte: since,
          lte: before,
        },
        farm: {
          id: farm?.id,
          name: { contains: farm?.name, mode: "insensitive" },
        },
        cycle: { id: cycle?.id },
        offers: {
          some: {
            product: {
              name: { contains: offers?.product?.name, mode: "insensitive" },
              category_id: offers?.product?.category?.id,
            },
            ...(typeof offers?.expired === "boolean" &&
              (offers.expired
                ? {
                    AND: [
                      { expires_at: { lte: new Date() } },
                      { expires_at: { not: null } },
                    ],
                  }
                : {
                    OR: [
                      { expires_at: { gt: new Date() } },
                      { expires_at: null },
                    ],
                  })),
          },
        },
      },
      include:
        type === "catalog-and-farm"
          ? { farm: { include: { admin: true } } }
          : type === "catalog-and-offers"
          ? {
              farm: { include: { admin: true } },
              offers: {
                include: { product: true },
                ...(offers?.page && { skip: (offers.page - 1) * 20, take: 20 }),
                orderBy: {
                  product: {
                    name: "asc",
                  },
                },
              },
            }
          : null,
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    switch (type) {
      default:
        return catalogs.map(PrismaCatalogMapper.toDomain<T>);
      case "catalog-and-farm":
        return catalogs.map((catalog) =>
          PrismaCatalogAndFarmMapper.toDomain<T>(
            catalog as PrismaCatalogAndFarm
          )
        );
      case "catalog-and-offers":
        return catalogs.map((catalog) =>
          PrismaCatalogAndOffersMapper.toDomain<T>(
            catalog as PrismaCatalogAndOffers
          )
        );
    }
  }

  async create(catalog: Catalog): Promise<void> {
    await prisma.$transaction(async (ctx) => {
      await ctx.catalog.create({
        data: PrismaCatalogMapper.toPrisma(catalog),
      });

      await ctx.offer.createMany({
        data: catalog.offers.map(PrismaOfferMapper.toPrisma),
      });
    });
  }

  async update(catalog: Catalog): Promise<void> {
    await prisma.$transaction(async (ctx) => {
      await ctx.catalog.update({
        where: { id: catalog.id.value },
        data: PrismaCatalogMapper.toPrisma(catalog),
      });

      await ctx.offer.createMany({
        data: catalog.offers.map(PrismaOfferMapper.toPrisma),
      });
    });
  }
}
