// Entities
import { Category } from "@/core/entities/category";

// Repositories
import {
  CategoriesRepository,
  CategoriesRepositorySearchRequest,
  CategoryEntityOf,
  CategoryRepositoryReturnType,
} from "@/core/repositories/categories-repository";

// Utils
import { paginate } from "@/test/utils/paginate";

export class InMemoryCategoriesRepository implements CategoriesRepository {
  items: Category[] = [];

  async find<T extends CategoryRepositoryReturnType>(
    _: T,
    { id, name }: CategoriesRepositorySearchRequest
  ): Promise<CategoryEntityOf<T> | null> {
    const category = this.items.find((item) =>
      Boolean(
        (!id || item.id.equals(id)) &&
          (!name || item.name.toLowerCase().includes(name.toLowerCase()))
      )
    );

    if (!category) return null;

    return category as CategoryEntityOf<T>;
  }

  async list<T extends CategoryRepositoryReturnType>(
    _: T,
    { id, name }: CategoriesRepositorySearchRequest,
    page: number
  ): Promise<CategoryEntityOf<T>[]> {
    let categories = this.items.filter((item) =>
      Boolean(
        (!id || item.id.equals(id)) &&
          (!name || item.name.toLowerCase().includes(name.toLowerCase()))
      )
    );

    if (page) categories = paginate(categories, page);

    return categories as CategoryEntityOf<T>[];
  }

  async create(category: Category): Promise<void> {
    this.items.push(category);
  }

  async update(category: Category): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(category.id));
    this.items[index] = category;
  }
}
