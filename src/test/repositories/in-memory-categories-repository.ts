// Entities
import { Category } from "@/core/entities/category";

// Repositories
import {
  CategoriesRepository,
  CategoriesRepositorySearchRequest,
} from "@/core/repositories/categories-repository";
import { RepositoryResponse } from "@/core/types/repository-response";

// Utils
import { filter } from "@/test/utils/filter";
import { find } from "@/test/utils/find";

export class InMemoryCategoriesRepository implements CategoriesRepository {
  items: Category[] = [];

  async find(
    _: RepositoryResponse,
    { id, name }: CategoriesRepositorySearchRequest
  ): Promise<Category | null> {
    const category = await find<Category>(this.items, async (item) => {
      return (
        (!id || item.id.equals(id)) &&
        (!name || item.name.toLowerCase().includes(name.toLowerCase()))
      );
    });

    if (!category) return null;

    return category;
  }

  async list(
    _: RepositoryResponse,
    { id, name }: CategoriesRepositorySearchRequest,
    page: number
  ): Promise<Category[]> {
    let categories = await filter<Category>(this.items, async (item) => {
      return (
        (!id || item.id.equals(id)) &&
        (!name || item.name.toLowerCase().includes(name.toLowerCase()))
      );
    });

    if (page) categories = this.slice(categories, page);

    return categories;
  }

  async create(category: Category): Promise<void> {
    this.items.push(category);
  }

  async update(category: Category): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(category.id));
    this.items[index] = category;
  }

  private slice(
    items: Category[],
    page: number,
    size: number = 20
  ): Category[] {
    const start = (page - 1) * size;
    const end = start + size;
    return items.slice(start, end);
  }
}
