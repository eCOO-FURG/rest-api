// Entities
import { Category } from "@/core/entities/category";
import { CategoryAndOffers } from "@/core/entities/aggregates/category-and-offers";

export type CategoryRepositoryReturnType = "category" | "category-and-offers";

export type CategoryEntityOf<T extends CategoryRepositoryReturnType> =
  T extends "category"
    ? Category
    : T extends "category-and-offers"
    ? CategoryAndOffers
    : never;

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
