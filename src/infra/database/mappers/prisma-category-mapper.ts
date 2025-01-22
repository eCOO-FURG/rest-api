// Libs
import { Prisma } from "@prisma/client";

// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Category } from "@/core/entities/category";

type PrismaCategory = Prisma.CategoryGetPayload<{}>;

export class PrismaCategoryMapper {
  static toDomain(raw: PrismaCategory): Category {
    return Category.create({
      id: new UUID(raw.id),
      name: raw.name,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
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
