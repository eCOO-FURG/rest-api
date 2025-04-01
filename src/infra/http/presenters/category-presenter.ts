// Entities
import { Category, CategoryProps } from "@/core/entities/category";
import { CategoryAndOffers } from "@/core/entities/aggregates/category-and-offers";

// Types
import { View } from "@/infra/types/view";

// Presenters
import { OfferPresenter } from "@/infra/http/presenters/offer-presenter";

export class CategoryPresenter {
  static toHttp(category?: Category | CategoryAndOffers): View<CategoryProps> {
    if (category instanceof CategoryAndOffers) {
      return {
        id: category.id.value,
        name: category.name,
        offers: category.offers.map(OfferPresenter.toHttp),
        created_at: category.created_at,
        updated_at: category.updated_at,
      };
    }

    if (category) {
      return {
        id: category.id.value,
        name: category.name,
        created_at: category.created_at,
        updated_at: category.updated_at,
      };
    }
  }
}
