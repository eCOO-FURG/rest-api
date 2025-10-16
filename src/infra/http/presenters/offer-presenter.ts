// Entities
import { Offer, OfferProps } from "@/core/entities/offer";

// Types
import { View } from "@/infra/types/view";

// Presenters
import { ProductPresenter } from "@/infra/http/presenters/product-presenter";
import { FarmPresenter } from "./farm-presenter";
import { CyclePresenter } from "./cycle-presenter";
import { MarketPresenter } from "./market-presenter";

export class OfferPresenter {
  static toHttp(offer?: Offer): View<OfferProps> {
    if (offer) {
      return {
        id: offer.id.value,
        amount: offer.amount,
        price: offer.price,
        fee: offer.fee,
        total: offer.total,
        description: offer.description,
        comment: offer.comment,
        expires_at: offer.expires_at,
        active: offer.active,
        opens_at: offer.opens_at,
        closes_at: offer.closes_at,
        farm_id: offer.farm_id.value,
        farm: FarmPresenter.toHttp(offer.farm),
        cycle_id: offer.cycle_id ? offer.cycle_id.value : null,
        cycle: CyclePresenter.toHttp(offer.cycle),
        market_id: offer.market_id ? offer.market_id.value : null,
        market: MarketPresenter.toHttp(offer.market),
        product_id: offer.product_id.value,
        product: ProductPresenter.toHttp(offer.product),
        created_at: offer.created_at,
        updated_at: offer.updated_at,
      };
    }
  }
}
