// Entities
import { Market, MarketProps } from "@/core/entities/market";

// Types
import { View } from "@/infra/types/view";
import { OfferPresenter } from "./offer-presenter";

export class MarketPresenter {
  static toHttp(market?: Market | null): View<MarketProps> | null {
    if (market === null) {
      return null;
    }

    if (market) {
      return {
        id: market.id.value,
        name: market.name,
        open: market.open,
        description: market.description,
        offers: market.offers.map(OfferPresenter.toHttp),
        created_at: market.created_at,
        updated_at: market.updated_at,
      };
    }
  }
}
