// Entities
import { Product } from "@/core/entities/product";

export class ProductPresenter {
  static toHTTP(product: Product){
    return {
      id: product.id.value,
      name: product.name,
      image: product.image,
      pricing: product.pricing,
      created_at: product.created_at,
      updated_at: product.updated_at
    }
  }
}