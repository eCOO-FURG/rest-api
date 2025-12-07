// Entities
import { CategoryAndOffers } from "@/core/entities/aggregates/category-and-offers";
import { Category, CategoryProps } from "@/core/entities/category";

// Types
import { View } from "@/infra/types/view";

// Presenters
import { OfferPresenter } from "@/infra/http/presenters/offer-presenter";

export class CategoryPresenter {
  static toHttp(category?: Category | CategoryAndOffers): View<CategoryProps> | null {
    if (category === null) {
      return null;
    }

    if (category instanceof CategoryAndOffers) {
      return {
        id: category.id.value,
        name: category.name,
        image: category.image,
        offers: category.offers.map(OfferPresenter.toHttp),
        created_at: category.created_at,
        updated_at: category.updated_at,
      };
    }

    if (category) {
      return {
        id: category.id.value,
        name: category.name,
        image: category.image,
        created_at: category.created_at,
        updated_at: category.updated_at,
      };
    }
  }
}
