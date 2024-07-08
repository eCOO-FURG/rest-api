// Libs
import { Product as PrismaProduct, Prisma } from "@prisma/client";

// Entities
import { Product } from "@/core/entities/product";
import { UUID } from "@/core/entities/value-objects/uuid";

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct) {
    return Product.create({
      ...raw,
      id: new UUID(raw.id),
    });
  }

  static toPrisma(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      ...product.props,
      id: product.id.value,
    };
  }
}
