// Entities
import { Market, MarketProps } from "@/core/entities/market";

// Types
import { View } from "@/infra/types/view";

export class MarketPresenter {
  static toHttp(market?: Market): View<MarketProps> {
    if (market)
      return {
        id: market.id.value,
        name: market.name,
        open: market.open,
        description: market.description,
        created_at: market.created_at,
        updated_at: market.updated_at,
      };
  }
}
