// Entities
import { Product } from "@/core/entities/product";

export interface ProductsRepository {
  findById(id: string): Promise<Product | null>;
  create(product: Product): Promise<void>;
}
