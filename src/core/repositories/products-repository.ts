// Entities
import { pricings, Product } from "@/core/entities/product";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export interface ProductsRepositorySearchRequest {
  id?: string;
  name?: string;
  pricing?: pricings
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
  update(product: Product): Promise<void>;
}
