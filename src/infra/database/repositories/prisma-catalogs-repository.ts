// Entities
import { Catalog } from "@/core/entities/catalog";

// Repositories
import {
  CatalogsRepository,
  CatalogsRepositorySearchRequest,
} from "@/core/repositories/catalogs-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaCatalogMapper } from "@/infra/database/mappers/prisma-catalog-mapper";
import { PrismaOfferMapper } from "@/infra/database/mappers/prisma-offer-mapper";

export class PrismaCatalogsRepository implements CatalogsRepository {
  async find(
    type: RepositoryResponse,
    { id, cycle, farm, offers, since, before }: CatalogsRepositorySearchRequest
  ): Promise<Catalog | null> {
    const catalog = await prisma.catalog.findFirst({
      where: {
        id,
        cycle: { id: cycle?.id },
        farm: {
          id: farm?.id,
          name: { contains: farm?.name, mode: "insensitive" },
        },
        created_at: { lte: before, gte: since },
        offers: {
          some: {
            product: {
              name: { contains: offers?.product?.name, mode: "insensitive" },
            },
          },
        },
      },
      include: {
        ...(type !== "basic" && {
          farm: { include: { admin: true } },
        }),
        ...(type === "merge" && {
          offers: {
            ...(offers?.product?.name && {
              where: {
                product: {
                  name: { contains: offers.product.name, mode: "insensitive" },
                },
              },
            }),
            include: { product: true },
            orderBy: { created_at: "asc" },
            ...(offers?.page && {
              skip: (offers.page - 1) * 20,
              take: 20,
            }),
          },
        }),
      },
    });

    if (!catalog) return null;

    return PrismaCatalogMapper.toDomain(catalog);
  }
  async list(
    type: RepositoryResponse,
    {
      cycle,
      farm,
      offers,
      since,
      before,
      admin,
    }: CatalogsRepositorySearchRequest,
    page?: number
  ): Promise<Catalog[]> {
    const catalogs = await prisma.catalog.findMany({
      where: {
        cycle: { id: cycle?.id },
        farm: {
          id: farm?.id,
          name: { contains: farm?.name, mode: "insensitive" },
        },
        offers: {
          some: {
            product: {
              name: { contains: offers?.product?.name, mode: "insensitive" },
            },
          },
        },
        created_at: { lte: before, gte: since },
      },
      include: {
        ...(type !== "basic" && { farm: { include: { admin: true } } }),
        ...(type === "merge" && {
          offers: {
            include: { product: true, ...(admin && { orders: true }) },
            orderBy: { created_at: "asc" },
            ...(offers?.page && {
              skip: (offers.page - 1) * 20,
              take: 20,
            }),
          },
        }),
      },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    return catalogs.map(PrismaCatalogMapper.toDomain);
  }

  async create(catalog: Catalog): Promise<void> {
    const data = PrismaCatalogMapper.toPrisma(catalog);

    await prisma.$transaction(async (ctx) => {
      await ctx.catalog.create({ data });

      const offers = Array.from(catalog.offers.values()).map(
        PrismaOfferMapper.toPrisma
      );

      await ctx.offer.createMany({ data: offers });
    });
  }

  async update(catalog: Catalog): Promise<void> {
    const data = PrismaCatalogMapper.toPrisma(catalog);

    await prisma.$transaction(async (ctx) => {
      await ctx.catalog.update({ where: { id: catalog.id.value }, data });

      const previous = await ctx.offer.findMany({
        where: { catalog_id: catalog.id.value },
      });

      const created = [];

      for (const offer of catalog.offers.values()) {
        const existed = previous.find((p) => offer.id.equals(p.id));

        if (!existed) {
          created.push(offer);
          continue;
        }

        if (existed.updated_at === offer.updated_at) continue;

        await ctx.offer.update({
          where: { id: offer.id.value },
          data: PrismaOfferMapper.toPrisma(offer),
        });
      }

      await ctx.offer.createMany({
        data: created.map(PrismaOfferMapper.toPrisma),
      });

      const deletedIds = previous
        .filter((p) => !catalog.offers.has(p.id))
        .map((offer) => offer.id);

      if (deletedIds.length)
        await ctx.offer.deleteMany({ where: { id: { in: deletedIds } } });
    });
  }
}
