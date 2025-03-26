// Entities
import { Product } from "@/core/entities/product";
import { ProductAndCategory } from "@/core/entities/aggregates/product-and-category";

// Repositories
import {
  ProductsRepository,
  ProductsRepositorySearchRequest,
  ProductRepositoryReturnType,
  ProductEntityOf,
} from "@/core/repositories/products-repository";

// Utils
import { paginate } from "@/test/utils/paginate";

// Factories
import { makeCategory } from "@/test/factories/make-category";
export class InMemoryProductsRepository implements ProductsRepository {
  items: Product[] = [];

  async find<T extends ProductRepositoryReturnType>(
    type: T,
    { id, name, pricing, archived, category }: ProductsRepositorySearchRequest
  ): Promise<ProductEntityOf<T> | null> {
    const product = this.items.find((item) => {
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

    switch (type) {
      default:
        return product as ProductEntityOf<T>;
      case "product-and-category":
        return ProductAndCategory.create({
          ...product.props,
          category: product.category ?? makeCategory(),
        }) as ProductEntityOf<T>;
    }
  }

  async list<T extends ProductRepositoryReturnType>(
    type: T,
    { id, name, pricing, archived, category }: ProductsRepositorySearchRequest,
    page: number
  ): Promise<ProductEntityOf<T>[]> {
    let products = this.items.filter((item) => {
      return Boolean(
        (!id || item.id.equals(id)) &&
          (!name || item.name.toLowerCase().includes(name.toLowerCase())) &&
          (!pricing || item.pricing === pricing) &&
          (!archived || item.archived === archived) &&
          (!category?.id || item.category_id?.equals(category.id)) &&
          (!category?.name || item.category?.name === category.name)
      );
    });

    if (page) products = paginate(products, page);

    switch (type) {
      default:
        return products as ProductEntityOf<T>[];
      case "product-and-category":
        return products.map((product) => {
          return ProductAndCategory.create({
            ...product.props,
            category: product.category ?? makeCategory(),
          }) as ProductEntityOf<T>;
        });
    }
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
