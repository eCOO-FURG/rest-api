// Entities
import { Market, MarketProps } from "@/core/entities/market";

// Types
import { View } from "@/infra/types/view";

// Presenters
import { PaginationPresenter } from "@/infra/http/presenters/pagination-presenter";

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
        offers: PaginationPresenter.toHttp(market.offers),
        created_at: market.created_at,
        updated_at: market.updated_at,
      };
    }
  }
}
