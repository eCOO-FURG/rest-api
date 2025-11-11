// Entities
import { Offer, OfferProps } from "@/core/entities/offer";
import { Merchandise } from "@/core/entities/aggregates/merchandise";

// Types
import { View } from "@/infra/types/view";

// Presenters
import { ProductPresenter } from "@/infra/http/presenters/product-presenter";
import { FarmPresenter } from "@/infra/http/presenters/farm-presenter";
import { CyclePresenter } from "@/infra/http/presenters/cycle-presenter";
import { MarketPresenter } from "@/infra/http/presenters/market-presenter";

export class OfferPresenter {
  static toHttp(offer?: Offer): View<OfferProps> {
    if (offer instanceof Merchandise) {
      return {
        id: offer.id.value,
        amount: offer.amount,
        price: offer.price,
        subtotal: offer.subtotal,
        fee: offer.fee,
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

    if (offer instanceof Offer) {
      return {
        id: offer.id.value,
        amount: offer.amount,
        price: offer.price,
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
