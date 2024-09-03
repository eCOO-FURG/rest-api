// Entities
import { OfferAggregate } from "@/core/entities/aggregates/offer-aggregate";

// Presenters
import { ProductPresenter } from "@/infra/http/presenters/product-presenter";

export class OfferPresenter {
  static toHttp(offer: OfferAggregate) {
    return {
      id: offer.id.value,
      amount: offer.amount,
      price: offer.price,
      description: offer.description,
      catalog_id: offer.catalog_id.value,
      product: ProductPresenter.toHttp(offer.product),
      created_at: offer.created_at,
      updated_at: offer.updated_at,
    };
  }
}
