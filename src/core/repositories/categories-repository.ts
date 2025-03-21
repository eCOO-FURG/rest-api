// Entities
import { Category } from "@/core/entities/category";

export type CategoryRepositoryReturnType = "category";

export type CategoryEntityOf<T extends CategoryRepositoryReturnType> =
  T extends "category" ? Category : never;

export interface CategoriesRepositorySearchRequest {
  id?: string;
  name?: string;
}

export interface CategoriesRepository {
  find<T extends CategoryRepositoryReturnType>(
    type: T,
    filters: CategoriesRepositorySearchRequest
  ): Promise<CategoryEntityOf<T> | null>;
  list<T extends CategoryRepositoryReturnType>(
    type: T,
    filters: CategoriesRepositorySearchRequest,
    page?: number
  ): Promise<CategoryEntityOf<T>[]>;
  create(category: Category): Promise<void>;
  update(category: Category): Promise<void>;
}
