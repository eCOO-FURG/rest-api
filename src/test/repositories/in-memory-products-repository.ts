// Entities
import { Product } from "@/core/entities/product";

// Repositories
import {
  ProductsRepository,
  ProductsRepositorySearchRequest,
  ProductRepositoryReturnType,
  ProductEntityOf,
} from "@/core/repositories/products-repository";

// Utils
import { paginate } from "@/test/utils/paginate";

export class InMemoryProductsRepository implements ProductsRepository {
  items: ProductEntityOf<ProductRepositoryReturnType>[] = [];

  async find<T extends ProductRepositoryReturnType>(
    type: T,
    { id, name, pricing, archived, category }: ProductsRepositorySearchRequest,
  ): Promise<ProductEntityOf<T> | null> {
    const product = this.items.find((item) => {
      return Boolean(
        (!id || item.id.equals(id)) &&
          (!name || item.name.toLowerCase().includes(name.toLowerCase())) &&
          (!pricing || item.pricing === pricing) &&
          (!archived || item.archived === archived) &&
          (!category?.id || item.category_id?.equals(category.id)) &&
          (!category?.name || item.category?.name === category.name),
      );
    });

    if (!product) {
      return null;
    }

    return product as ProductEntityOf<T>;
  }

  async list<T extends ProductRepositoryReturnType>(
    type: T,
    { id, name, pricing, archived, category }: ProductsRepositorySearchRequest,
    page: number,
  ): Promise<ProductEntityOf<T>[]> {
    let products = this.items.filter((item) => {
      return Boolean(
        (!id || item.id.equals(id)) &&
          (!name || item.name.toLowerCase().includes(name.toLowerCase())) &&
          (!pricing || item.pricing === pricing) &&
          (!archived || item.archived === archived) &&
          (!category?.id || item.category_id?.equals(category.id)) &&
          (!category?.name || item.category?.name === category.name),
      );
    });

    if (page) {
      products = paginate(products, page);
    }

    return products as ProductEntityOf<T>[];
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
}
