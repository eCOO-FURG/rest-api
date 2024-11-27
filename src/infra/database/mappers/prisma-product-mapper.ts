// Libs
import { Product as PrismaProduct, Prisma } from "@prisma/client";

// Entities
import { Product } from "@/core/entities/product";
import { UUID } from "@/core/entities/aggregates/uuid";

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct) {
    return Product.create({
      ...raw,
      id: new UUID(raw.id),
      updated_at: raw.updated_at ?? null,
      perishable: raw.perishable,
    });
  }

  static toPrisma(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      ...product.props,
      id: product.id.value,
      perishable: product.perishable,
    };
  }
}
