// Entities
import { Catalog } from "@/core/entities/catalog";

// Repositories
import {
  CatalogsRepository,
  CatalogsRepositoryResponse,
  CatalogsRepositorySearchManyRequest,
  CatalogsRepositorySearchRequest,
} from "@/core/repositories/catalogs-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Libs
import { Prisma } from "@prisma/client";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappesrs
import { PrismaCatalogMapper } from "@/infra/database/mappers/prisma-catalog-mapper";
import { PrismaCatalogAggregateMapper } from "@/infra/database/mappers/prisma-catalog-aggregate-mapper";
import { PrismaCatalogMergeMapper } from "@/infra/database/mappers/prisma-catalog-merge-mapper";

export class PrismaCatalogsRepository implements CatalogsRepository {
  async search<T extends RepositoryResponse>(
    { cycle, farm, id, offer, since }: CatalogsRepositorySearchRequest,
    type: T
  ): Promise<CatalogsRepositoryResponse<T> | null> {
    const where: Prisma.CatalogWhereInput = {
      id,
      cycle,
      farm: {
        ...farm,
        name: {
          contains: farm?.name,
          mode: "insensitive",
        },
      },
      ...(since && { created_at: { gte: since } }),
    };

    if (type === "entity") {
      const catalog = await prisma.catalog.findFirst({ where });

      if (!catalog) return null;

      return PrismaCatalogMapper.toDomain(
        catalog
      ) as CatalogsRepositoryResponse<T>;
    }

    if (type === "aggregate") {
      const catalog = await prisma.catalog.findFirst({
        where,
        include: {
          farm: {
            include: {
              admin: true,
            },
          },
        },
      });

      if (!catalog) return null;

      return PrismaCatalogAggregateMapper.toDomain(
        catalog
      ) as CatalogsRepositoryResponse<T>;
    }

    const catalog = await prisma.catalog.findFirst({
      where,
      include: {
        farm: {
          include: {
            admin: true,
          },
        },
        offers: {
          include: {
            product: true,
          },
          where: {
            product: {
              name: {
                contains: offer?.product?.name,
                mode: "insensitive",
              },
            },
          },
          skip: ((offer?.page ?? 1) - 1) * 20,
          take: 20,
        },
      },
    });

    if (!catalog) return null;

    return PrismaCatalogMergeMapper.toDomain(
      catalog
    ) as CatalogsRepositoryResponse<T>;
  }

  async searchMany<T extends RepositoryResponse>(
    { cycle, offer, page, since }: CatalogsRepositorySearchManyRequest,
    type: T
  ): Promise<CatalogsRepositoryResponse<T>[]> {
    const query: Prisma.CatalogFindManyArgs = {
      where: {
        cycle,
        offers: {
          some: {
            product: {
              name: {
                contains: offer?.product?.name,
                mode: "insensitive",
              },
            },
          },
        },
        ...(since && { created_at: { gte: since } }),
      },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    };

    if (type === "entity") {
      const catalogs = await prisma.catalog.findMany(query);

      return catalogs.map((catalog) =>
        PrismaCatalogMapper.toDomain(catalog)
      ) as CatalogsRepositoryResponse<T>[];
    }

    if (type === "aggregate") {
      const catalogs = await prisma.catalog.findMany({
        ...query,
        include: {
          farm: { include: { admin: true } },
        },
      });

      return catalogs.map((catalog) =>
        PrismaCatalogAggregateMapper.toDomain(catalog)
      ) as CatalogsRepositoryResponse<T>[];
    }

    const catalogs = await prisma.catalog.findMany({
      ...query,
      include: {
        farm: { include: { admin: true } },
        offers: {
          include: {
            product: true,
          },
        },
      },
    });

    return catalogs.map((catalog) =>
      PrismaCatalogMergeMapper.toDomain(catalog)
    ) as CatalogsRepositoryResponse<T>[];
  }

  async create(catalog: Catalog): Promise<void> {
    const data = PrismaCatalogMapper.toPrisma(catalog);
    await prisma.catalog.create({ data });
  }
}
