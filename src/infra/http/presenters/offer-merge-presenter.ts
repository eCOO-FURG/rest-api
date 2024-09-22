// Entities
import { OfferMerge } from "@/core/entities/merged/offer-merge";

// Presenters
import { ProductPresenter } from "@/infra/http/presenters/product-presenter";
import { CatalogPresenter } from "@/infra/http/presenters/catalog-presenter";

export class OfferMergePresenter {
  static toHttp(offer: OfferMerge) {
    return {
      id: offer.id.value,
      amount: offer.amount,
      price: offer.price,
      description: offer.description,
      catalog: CatalogPresenter.toHttp(offer.catalog),
      product: ProductPresenter.toHttp(offer.product),
      created_at: offer.created_at,
      updated_at: offer.updated_at,
    };
  }
}
