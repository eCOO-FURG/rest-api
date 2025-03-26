// Libraries
import { Prisma, Product as PrismaProduct } from "@prisma/client";

// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Product } from "@/core/entities/product";

// Repositories
import {
  ProductRepositoryReturnType,
  ProductEntityOf,
} from "@/core/repositories/products-repository";

export class PrismaProductMapper {
  static toDomain<T extends ProductRepositoryReturnType = "product">(
    raw: PrismaProduct
  ): ProductEntityOf<T> {
    return Product.create({
      id: new UUID(raw.id),
      name: raw.name,
      image: raw.image,
      pricing: raw.pricing,
      archived: raw.archived,
      category_id: new UUID(raw.category_id),
      perishable: raw.perishable,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as ProductEntityOf<T>;
  }

  static toPrisma(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id.value,
      name: product.name,
      image: product.image,
      pricing: product.pricing,
      archived: product.archived,
      category_id: product.category_id?.value,
      perishable: product.perishable,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  }
}
