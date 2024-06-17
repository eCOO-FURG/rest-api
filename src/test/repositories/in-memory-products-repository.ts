// Entities
import { Product } from "@/core/entities/product";

// Repositories
import { ProductsRepository } from "@/core/repositories/products-repository";

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
}
