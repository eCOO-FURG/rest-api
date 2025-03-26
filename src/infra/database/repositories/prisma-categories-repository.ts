// Entities
import { Category } from "@/core/entities/category";

// Repositories
import {
  CategoriesRepository,
  CategoriesRepositorySearchRequest,
  CategoryRepositoryReturnType,
  CategoryEntityOf,
} from "@/core/repositories/categories-repository";

// Database
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaCategoryMapper } from "@/infra/database/mappers/prisma-category-mapper";

export class PrismaCategoriesRepository implements CategoriesRepository {
  async find<T extends CategoryRepositoryReturnType>(
    _: T,
    { id, name }: CategoriesRepositorySearchRequest
  ): Promise<CategoryEntityOf<T> | null> {
    const category = await prisma.category.findFirst({
      where: {
        id,
        name: { contains: name, mode: "insensitive" },
      },
    });

    if (!category) return null;

    return PrismaCategoryMapper.toDomain<T>(category);
  }

  async list<T extends CategoryRepositoryReturnType>(
    _: T,
    { name, id }: CategoriesRepositorySearchRequest,
    page?: number
  ): Promise<CategoryEntityOf<T>[]> {
    const categories = await prisma.category.findMany({
      where: {
        id,
        name: { contains: name, mode: "insensitive" },
      },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    return categories.map((category) =>
      PrismaCategoryMapper.toDomain<T>(category)
    );
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
