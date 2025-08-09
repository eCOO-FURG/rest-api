// Entities
import { ProductAndCategory } from "@/core/entities/aggregates/product-and-category";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import {
  Product as PrismaProduct,
  Category as PrismaCategory,
} from "@prisma/client";

// Repositories
import {
  ProductRepositoryReturnType,
  ProductEntityOf,
} from "@/core/repositories/products-repository";

// Mappers
import { PrismaCategoryMapper } from "@/infra/database/mappers/prisma-category-mapper";

export type PrismaProductAndCategory = PrismaProduct & {
  category: PrismaCategory;
};

export class PrismaProductAndCategoryMapper {
  static toDomain<
    T extends ProductRepositoryReturnType = "product-and-category",
  >(raw: PrismaProductAndCategory): ProductEntityOf<T> {
    return ProductAndCategory.create({
      id: new UUID(raw.id),
      name: raw.name,
      image: raw.image,
      pricing: raw.pricing,
      archived: raw.archived,
      category_id: new UUID(raw.category_id),
      perishable: raw.perishable,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
      category: PrismaCategoryMapper.toDomain(raw.category),
    }) as ProductEntityOf<T>;
  }
}
