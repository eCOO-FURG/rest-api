// Entities
import { Product } from "@/core/entities/product";

// Repositories
import { ProductsRepository, ProductsRepositorySearchManyRequest } from "@/core/repositories/products-repository";

export class InMemoryProductsRepository implements ProductsRepository {
  items: Product[] = [];

  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id.equals(id));

    if (!product) return null;

    return product;
  }

  async create(product: Product): Promise<void> {
    this.items.push(product);
  }

  async searchMany({ page, name }: ProductsRepositorySearchManyRequest): Promise<Product[]> {
    if (!name) {
      return this.items.slice((page - 1) * 20, page * 20)
    }

    return this.items.filter((product) => product.name === name).slice((page - 1) * 20, page * 20)
  }
}
