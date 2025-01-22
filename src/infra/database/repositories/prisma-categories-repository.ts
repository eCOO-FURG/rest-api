// Entities
import { Category } from "@/core/entities/category";

// Repositories
import {
  CategoriesRepository,
  CategoriesRepositorySearchRequest,
} from "@/core/repositories/categories-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaCategoryMapper } from "@/infra/database/mappers/prisma-category-mapper";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export class PrismaCategoriesRepository implements CategoriesRepository {
  async find(
    _: RepositoryResponse,
    { id, name }: CategoriesRepositorySearchRequest
  ): Promise<Category | null> {
    const category = await prisma.category.findFirst({
      where: {
        id,
        ...(name && { name: { contains: name, mode: "insensitive" } }),
      },
    });

    if (!category) return null;

    return PrismaCategoryMapper.toDomain(category);
  }

  async list(
    _: RepositoryResponse,
    { name, id }: CategoriesRepositorySearchRequest,
    page?: number
  ): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      where: {
        id,
        ...(name && { name: { contains: name, mode: "insensitive" } }),
      },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    return categories.map((category) =>
      PrismaCategoryMapper.toDomain(category)
    );
  }

  async create(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrisma(category);

    await prisma.category.create({ data });
  }

  async update(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrisma(category);

    await prisma.category.update({
      where: { id: data.id },
      data,
    });
  }
}
