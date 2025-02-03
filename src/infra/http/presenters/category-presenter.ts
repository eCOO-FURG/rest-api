// Entities
import { Category, CategoryProps } from "@/core/entities/category";

// Types
import { View } from "@/infra/types/view";

export class CategoryPresenter {
  static toHttp(category?: Category): View<CategoryProps> {
    if (category)
      return {
        id: category.id.value,
        name: category.name,
        created_at: category.created_at,
        updated_at: category.updated_at,
      };
  }
}
