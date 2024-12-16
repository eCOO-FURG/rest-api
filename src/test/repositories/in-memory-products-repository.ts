// Entities
import { Product } from "@/core/entities/product";

// Repositories
import {
  ProductsRepository,
  ProductsRepositorySearchRequest,
} from "@/core/repositories/products-repository";
import { RepositoryResponse } from "@/core/types/repository-response";

export class InMemoryProductsRepository implements ProductsRepository {
  items: Product[] = [];

  async find(
    _: RepositoryResponse,
    { name, pricing }: ProductsRepositorySearchRequest
  ): Promise<Product | null> {
    return this.items.find(
      (item) =>
        (!name || item.name.toLowerCase().includes(name.toLowerCase())) &&
        (!pricing || item.pricing === pricing)
    ) || null;
  }

  async list(
    _: RepositoryResponse,
    { name }: ProductsRepositorySearchRequest
  ): Promise<Product[]> {
    return this.items.filter(
      (item) => !name || item.name.toLowerCase().includes(name.toLowerCase())
    );
  }  

  async create(product: Product): Promise<void> {
    this.items.push(product);
  }

  private slice(items: Product[], page: number, size: number = 20): Product[] {
    const start = (page - 1) * size;
    const end = start + size;
    return items.slice(start, end);
  }

  async update(product: Product): Promise<void> {
    const index = this.items.findIndex((item) => item.id === product.id);

    if (index !== -1) {
      this.items[index] = product;
    }
  }
}
