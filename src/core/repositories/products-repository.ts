// Entities
import { Product } from "@/core/entities/product";

export interface ProductsRepositorySearchManyRequest{
  page: number
  name?: string
}

export interface ProductsRepository {
  findById(id: string): Promise<Product | null>;
  create(product: Product): Promise<void>;
  searchMany({ page, name }: ProductsRepositorySearchManyRequest): Promise<Product[]>
}
