// Entities
import { Product } from "@/core/entities/product";

// Repositories
import {
  ProductsRepository,
  ProductsRepositorySearchRequest,
} from "@/core/repositories/products-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaProductMapper } from "@/infra/database/mappers/prisma-product-mapper";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export class PrismaProductRepository implements ProductsRepository {
  async find(
    _: RepositoryResponse,
    { id, name, pricing, archived, category }: ProductsRepositorySearchRequest
  ): Promise<Product | null> {
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
    });

    if (!product) return null;

    return PrismaProductMapper.toDomain(product);
  }

  async list(
    type: RepositoryResponse,
    { name, id, archived, pricing, category }: ProductsRepositorySearchRequest,
    page?: number
  ): Promise<Product[]> {
    const products = await prisma.product.findMany({
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
        ...(type === "merge" && {
          category: true,
        }),
      },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    return products.map((product) => PrismaProductMapper.toDomain(product));
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
