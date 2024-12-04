// Entities
import { Product, ProductProps } from "@/core/entities/product";

// Types
import { View } from "@/infra/types/view";

export class ProductPresenter {
  static toHttp(product?: Product): View<ProductProps> {
    if (product)
      return {
        id: product.id.value,
        name: product.name,
        image: product.image,
        pricing: product.pricing,
        created_at: product.created_at,
        updated_at: product.updated_at,
      };
  }
}
