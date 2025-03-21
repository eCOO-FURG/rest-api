// Libs
import { Prisma } from "@prisma/client";

// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Category } from "@/core/entities/category";

// Repositories
import {
  CategoryRepositoryReturnType,
  CategoryEntityOf,
} from "@/core/repositories/categories-repository";

type PrismaCategory = Prisma.CategoryGetPayload<{}>;

export class PrismaCategoryMapper {
  static toDomain<T extends CategoryRepositoryReturnType>(
    raw: PrismaCategory
  ): CategoryEntityOf<T> {
    return Category.create({
      id: new UUID(raw.id),
      name: raw.name,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as CategoryEntityOf<T>;
  }

  static toPrisma(category: Category): Prisma.CategoryUncheckedCreateInput {
    return {
      id: category.id.value,
      name: category.name,
      created_at: category.created_at,
      updated_at: category.updated_at,
    };
  }
}
