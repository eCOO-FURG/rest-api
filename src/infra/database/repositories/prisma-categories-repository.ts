// Entities
import { Category } from "@/core/entities/category";

// Repositories
import {
  CategoriesRepository,
  CategoriesRepositorySearchRequest,
  CategoryEntityOf,
  CategoryRepositoryReturnType,
} from "@/core/repositories/categories-repository";

// Database
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaCategoryAndOffers, PrismaCategoryAndOffersMapper } from "@/infra/database/mappers/prisma-category-and-offers-mapper";
import { PrismaCategoryMapper } from "@/infra/database/mappers/prisma-category-mapper";

// Utils
import { now } from "@/core/utils/now";

export class PrismaCategoriesRepository implements CategoriesRepository {
  async find<T extends CategoryRepositoryReturnType>(
    type: T,
    { id, name, offers, since, before }: CategoriesRepositorySearchRequest,
  ): Promise<CategoryEntityOf<T> | null> {
    const category = await prisma.category.findFirst({
      where: {
        id,
        name: { contains: name, mode: "insensitive" },
        created_at: {
          gte: since,
          lte: before,
        },
      },
      include:
        type === "category-and-offers"
          ? {
              products: {
                include: {
                  offers: {
                    where: {
                      catalog: { cycle: { id: offers?.catalog?.cycle.id } },
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
                                  amount: { not: 0 },
                                },
                              ],
                            }
                          : {
                              OR: [
                                { closes_at: { not: null, lte: now() } },
                                { expires_at: { not: null, lte: now() } },
                                { active: false },
                                { amount: 0 },
                              ],
                            })),
                      created_at: {
                        gte: offers?.since,
                        lte: offers?.before,
                      },
                    },
                    include: {
                      catalog: {
                        include: {
                          farm: {
                            include: {
                              admin: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
                ...(offers?.page && {
                  skip: (offers.page - 1) * 20,
                  take: 20,
                }),
              },
            }
          : null,
    });

    if (!category) return null;

    switch (type) {
      default:
        return PrismaCategoryMapper.toDomain<T>(category);
      case "category-and-offers":
        return PrismaCategoryAndOffersMapper.toDomain<T>(category as PrismaCategoryAndOffers);
    }
  }

  async list<T extends CategoryRepositoryReturnType>(
    type: T,
    { id, name, offers, since, before }: CategoriesRepositorySearchRequest,
    page?: number,
  ): Promise<CategoryEntityOf<T>[]> {
    const categories = await prisma.category.findMany({
      where: {
        id,
        name: { contains: name, mode: "insensitive" },
        created_at: {
          gte: since,
          lte: before,
        },
        ...(offers && {
          products: {
            some: {
              offers: {
                some: {
                  catalog: { cycle: { id: offers.catalog?.cycle.id } },
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
                              amount: { not: 0 },
                            },
                          ],
                        }
                      : {
                          OR: [
                            { closes_at: { not: null, lte: now() } },
                            { expires_at: { not: null, lte: now() } },
                            { active: false },
                            { amount: 0 },
                          ],
                        })),
                  created_at: {
                    gte: offers.since,
                  },
                },
              },
            },
          },
        }),
      },
      include:
        type === "category-and-offers"
          ? {
              products: {
                include: {
                  offers: {
                    include: {
                      catalog: {
                        include: {
                          farm: {
                            include: {
                              admin: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
                ...(offers?.page && {
                  skip: (offers.page - 1) * 20,
                  take: 20,
                }),
              },
            }
          : null,
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    switch (type) {
      default:
        return categories.map((category) => PrismaCategoryMapper.toDomain<T>(category));
      case "category-and-offers":
        return categories.map((category) => PrismaCategoryAndOffersMapper.toDomain<T>(category as PrismaCategoryAndOffers));
    }
  }

  async create(category: Category): Promise<void> {
    await prisma.category.create({
      data: PrismaCategoryMapper.toPrisma(category),
    });
  }

  async update(category: Category): Promise<void> {
    await prisma.category.update({
      where: { id: category.id.value },
      data: PrismaCategoryMapper.toPrisma(category),
    });
  }
}
