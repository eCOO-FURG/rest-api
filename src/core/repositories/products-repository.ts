// Entities
import { Product } from "@/core/entities/product";
import { ProductAndCategory } from "@/core/entities/aggregates/product-and-category";

export type ProductRepositoryReturnType = "product" | "product-and-category";

export type ProductEntityOf<T extends ProductRepositoryReturnType> = T extends "product"
  ? Product
  : T extends "product-and-category"
    ? ProductAndCategory
    : never;

export interface ProductsRepositorySearchRequest {
  id?: string;
  name?: string;
  pricing?: Product["pricing"];
  archived?: boolean;
  category?: { id?: string; name?: string };
}

export interface ProductsRepository {
  find<T extends ProductRepositoryReturnType>(type: T, filters: ProductsRepositorySearchRequest): Promise<ProductEntityOf<T> | null>;
  list<T extends ProductRepositoryReturnType>(
    type: T,
    filters: ProductsRepositorySearchRequest,
    page?: number,
  ): Promise<ProductEntityOf<T>[]>;
  create(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
}
