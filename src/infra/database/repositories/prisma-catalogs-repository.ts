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
import { PrismaCatalogMapper } from "@/infra/database/mappers/prisma-catalog-mapper";
import { PrismaCatalogAndFarmMapper } from "@/infra/database/mappers/prisma-catalog-and-farm-mapper";
import { PrismaOfferMapper } from "@/infra/database/mappers/prisma-offer-mapper";

export class PrismaCatalogsRepository implements CatalogsRepository {
  async find<T extends CatalogRepositoryReturnType>(
    type: T,
    { id, since, before, farm, cycle, offers }: CatalogsRepositorySearchRequest
  ): Promise<CatalogEntityOf<T> | null> {
    const catalog = await prisma.catalog.findFirst({
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
      },
      include: {
        ...(type === "catalog-and-farm" && {
          farm: { include: { admin: true } },
        }),
        // offers: {
        //   where: {
        //     product: {
        //       name: { contains: offers?.product?.name, mode: "insensitive" },
        //     },
        //     ...(typeof offers?.expired === "boolean" &&
        //       (offers.expired
        //         ? {
        //             AND: [
        //               { expires_at: { lte: new Date() } },
        //               { expires_at: { not: null } },
        //             ],
        //           }
        //         : {
        //             OR: [
        //               { expires_at: { gt: new Date() } },
        //               { expires_at: null },
        //             ],
        //           })),
        //   },
        //   ...(offers?.page && { skip: (offers.page - 1) * 20, take: 20 }),
        // },
      },
    });

    if (!catalog) return null;

    switch (type) {
      default:
        return PrismaCatalogMapper.toDomain<T>(catalog);
      case "catalog-and-farm":
        return PrismaCatalogAndFarmMapper.toDomain<T>(catalog);
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
      },
      include: {
        ...(type === "catalog-and-farm" && {
          farm: { include: { admin: true } },
        }),
      },
    });

    switch (type) {
      default:
        return catalogs.map(PrismaCatalogMapper.toDomain<T>);
      case "catalog-and-farm":
        return catalogs.map(PrismaCatalogAndFarmMapper.toDomain<T>);
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
    await prisma.catalog.update({
      where: { id: catalog.id.value },
      data: PrismaCatalogMapper.toPrisma(catalog),
    });
  }
}
