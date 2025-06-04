// Entities
import { CategoryAndOffers } from "@/core/entities/aggregates/category-and-offers";
import { Category } from "@/core/entities/category";

export type CategoryRepositoryReturnType = "category" | "category-and-offers";

export type CategoryEntityOf<T extends CategoryRepositoryReturnType> = T extends "category"
  ? Category
  : T extends "category-and-offers"
    ? CategoryAndOffers
    : never;

export interface CategoriesRepositorySearchRequest {
  id?: string;
  name?: string;
  offers?: {
    cycle_id?: string;
    since?: Date;
    page?: number;
    available?: boolean;
  };
}

export interface CategoriesRepository {
  find<T extends CategoryRepositoryReturnType>(type: T, filters: CategoriesRepositorySearchRequest): Promise<CategoryEntityOf<T> | null>;
  list<T extends CategoryRepositoryReturnType>(
    type: T,
    filters: CategoriesRepositorySearchRequest,
    page?: number,
  ): Promise<CategoryEntityOf<T>[]>;
  create(category: Category): Promise<void>;
  update(category: Category): Promise<void>;
}
