// Libraries
import { Prisma } from "@prisma/client";

// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Product } from "@/core/entities/product";
import { PrismaCategoryMapper } from "./prisma-category-mapper";

type PrismaProduct = Prisma.ProductGetPayload<{}> & {
  category?: Prisma.CategoryGetPayload<{}>;
};

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    return Product.create({
      id: new UUID(raw.id),
      name: raw.name,
      image: raw.image,
      pricing: raw.pricing,
      archived: raw.archived,
      category_id: new UUID(raw.category_id),
      ...(raw.category && {
        category: PrismaCategoryMapper.toDomain(raw.category),
      }),
      perishable: raw.perishable,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
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
