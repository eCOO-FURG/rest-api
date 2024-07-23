// Entities
import { Product } from "@/core/entities/product";

export interface ProductsRepository {
  findById(id: string): Promise<Product | null>;
  findMany(page: number, name?: string): Promise<Product[]>;
  create(product: Product): Promise<void>;
}
