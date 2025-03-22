// Entities
import { Product } from "@/core/entities/product";

// Repositories
import {
  ProductsRepository,
  ProductsRepositorySearchRequest,
} from "@/core/repositories/products-repository";
import { RepositoryResponse } from "@/core/types/repository-response";

// Utils
import { filter } from "@/test/utils/filter";
import { find } from "@/test/utils/find";

export class InMemoryProductsRepository implements ProductsRepository {
  items: Product[] = [];

  async find(
    _: RepositoryResponse,
    { id, name, pricing, archived, category }: ProductsRepositorySearchRequest
  ): Promise<Product | null> {
    const product = await find<Product>(this.items, async (item) => {
      return Boolean(
        (!id || item.id.equals(id)) &&
          (!name || item.name.toLowerCase() === name.toLowerCase()) &&
          (!pricing || item.pricing === pricing) &&
          (!archived || item.archived === archived) &&
          (!category?.id || item.category_id?.equals(category.id)) &&
          (!category?.name || item.category?.name === category.name)
      );
    });

    if (!product) return null;

    return product;
  }

  async list(
    _: RepositoryResponse,
    { id, name, pricing, archived, category }: ProductsRepositorySearchRequest,
    page: number
  ): Promise<Product[]> {
    let products = await filter<Product>(this.items, async (item) => {
      return Boolean(
        (!id || item.id.equals(id)) &&
          (!name || item.name.toLowerCase().includes(name.toLowerCase())) &&
          (!pricing || item.pricing === pricing) &&
          (!archived || item.archived === archived) &&
          (!category?.id || item.category_id?.equals(category.id)) &&
          (!category?.name || item.category?.name === category.name)
      );
    });

    if (page) products = this.slice(products, page);

    return products;
  }

  async create(product: Product): Promise<void> {
    this.items.push(product);
  }

  async update(product: Product): Promise<void> {
    const index = this.items.findIndex((item) => item.id === product.id);

    if (index !== -1) {
      this.items[index] = product;
    }
  }

  private slice(items: Product[], page: number, size: number = 20): Product[] {
    const start = (page - 1) * size;
    const end = start + size;
    return items.slice(start, end);
  }
}
