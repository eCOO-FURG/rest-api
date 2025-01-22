// Entities
import { Category } from "@/core/entities/category";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export interface CategoriesRepositorySearchRequest {
  id?: string;
  name?: string;
}

export interface CategoriesRepository {
  find(
    type: RepositoryResponse,
    filters: CategoriesRepositorySearchRequest
  ): Promise<Category | null>;
  list(
    type: RepositoryResponse,
    filters: CategoriesRepositorySearchRequest,
    page?: number
  ): Promise<Category[]>;
  create(category: Category): Promise<void>;
  update(category: Category): Promise<void>;
}
