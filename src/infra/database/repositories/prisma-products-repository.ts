// Entities
import { Product } from "@/core/entities/product";

// Repositories
import { ProductsRepository, ProductsRepositorySearchRequest } from "@/core/repositories/products-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaProductAndCategoryMapper } from "@/infra/database/mappers/prisma-product-and-category-mapper";
import { PrismaProductMapper } from "@/infra/database/mappers/prisma-product-mapper";

// Types
import { ProductEntityOf, ProductRepositoryReturnType } from "@/core/repositories/products-repository";

export class PrismaProductRepository implements ProductsRepository {
  async find<T extends ProductRepositoryReturnType>(
    type: T,
    { id, name, pricing, archived, category }: ProductsRepositorySearchRequest,
  ): Promise<ProductEntityOf<T> | null> {
    const product = await prisma.product.findFirst({
      where: {
        id,
        pricing,
        archived,
        category: {
          id: category?.id,
          ...(category?.name && {
            name: { contains: category.name, mode: "insensitive" },
          }),
        },
        ...(name && { name: { contains: name, mode: "insensitive" } }),
      },
      include: {
        category: type === "product-and-category",
      },
    });

    if (!product) return null;

    switch (type) {
      default:
        return PrismaProductMapper.toDomain<T>(product);
      case "product-and-category":
        return PrismaProductAndCategoryMapper.toDomain<T>(product);
    }
  }

  async list<T extends ProductRepositoryReturnType>(
    type: T,
    { name, id, archived, pricing, category }: ProductsRepositorySearchRequest,
    page?: number,
  ): Promise<ProductEntityOf<T>[]> {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
      where: {
        id,
        pricing,
        archived,
        name: { contains: name, mode: "insensitive" },
        category: {
          id: category?.id,
          name: { contains: category?.name, mode: "insensitive" },
        },
      },
      include: {
        category: type === "product-and-category",
      },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    switch (type) {
      default:
        return products.map(PrismaProductMapper.toDomain<T>);
      case "product-and-category":
        return products.map(PrismaProductAndCategoryMapper.toDomain<T>);
    }
  }

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);

    await prisma.product.create({ data });
  }

  async update(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);

    await prisma.product.update({ where: { id: data.id }, data });
  }
}
