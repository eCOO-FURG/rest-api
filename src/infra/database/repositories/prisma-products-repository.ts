// Entities
import { Product } from "@/core/entities/product";

// Repositories
import { ProductsRepository, ProductsRepositorySearchManyRequest } from "@/core/repositories/products-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";
import { PrismaProductMapper } from "@/infra/database/mappers/prisma-product-mapper";

export class PrismaProductRepository implements ProductsRepository {
  async findById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) return null;

    return PrismaProductMapper.toDomain(product);
  }
  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);

    await prisma.product.create({
      data,
    });
  }
  async searchMany({ page, name }: ProductsRepositorySearchManyRequest): Promise<Product[]> {
    const skip = (page - 1) * 20

    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive"
        }
      },
      skip,
      take: 20
    })

    const mapperedProducts = products.map((product) => PrismaProductMapper.toDomain(product))

    return mapperedProducts
  }
}
