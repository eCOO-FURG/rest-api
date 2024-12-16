// Entities
import { Product } from "@/core/entities/product";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export interface ProductsRepositorySearchRequest {
  id?: string;
  name?: string;
}

export interface ProductsRepository {
  find(
    type: RepositoryResponse,
    filters: ProductsRepositorySearchRequest
  ): Promise<Product | null>;
  list(
    type: RepositoryResponse,
    filters: ProductsRepositorySearchRequest,
    page?: number
  ): Promise<Product[]>;
  create(product: Product): Promise<void>;
}
