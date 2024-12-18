// Libs
import { Prisma } from "@prisma/client";

// Entities
import { Product } from "@/core/entities/product";
import { UUID } from "@/core/entities/aggregates/uuid";

type PrismaProduct = Prisma.ProductGetPayload<{}>;

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    return Product.create({
      id: new UUID(raw.id),
      name: raw.name,
      image: raw.image,
      pricing: raw.pricing,
      archived: raw.archived,
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
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  }
}
