// Entities
import { Product, ProductProps } from "@/core/entities/product";

// Types
import { View } from "@/infra/types/view";

// Presenters
import { CategoryPresenter } from "@/infra/http/presenters/category-presenter";

export class ProductPresenter {
  static toHttp(product?: Product): View<ProductProps> {
    if (product)
      return {
        id: product.id.value,
        name: product.name,
        image: product.image,
        pricing: product.pricing,
        category_id: product.category_id.value,
        perishable: product.perishable,
        category: CategoryPresenter.toHttp(product.category),
        created_at: product.created_at,
        updated_at: product.updated_at,
      };
  }
}
