// Entities
import { Offer, OfferProps } from "@/core/entities/offer";

// Types
import { View } from "@/infra/types/view";

// Presenters
import { ProductPresenter } from "@/infra/http/presenters/product-presenter";
import { CatalogPresenter } from "@/infra/http/presenters/catalog-presenter";

export class OfferPresenter {
  static toHttp(offer?: Offer): View<OfferProps> {
    if (offer)
      return {
        id: offer.id.value,
        amount: offer.amount,
        price: offer.price,
        description: offer.description,
        catalog_id: offer.catalog_id.value,
        catalog: CatalogPresenter.toHttp(offer.catalog),
        product_id: offer.product_id.value,
        product: ProductPresenter.toHttp(offer.product),
        created_at: offer.created_at,
        updated_at: offer.updated_at,
      };
  }
}
