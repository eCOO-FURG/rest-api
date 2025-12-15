// Entities
import { Market, MarketProps } from "@/core/entities/market";

// Types
import { View } from "@/infra/types/view";
import { MarketAndDetails } from "@/core/entities/aggregates/market-and-details";

export class MarketPresenter {
  static toHttp(market?: Market | null): View<MarketProps> | null {
    if (market === null) {
      return null;
    }

    if (market instanceof MarketAndDetails) {
      return {
        id: market.id.value,
        name: market.name,
        open: market.open,
        description: market.description,
        offers_count: market.offers_count,
        bags_count: market.bags_count,
        revenue: market.revenue,
        created_at: market.created_at,
        updated_at: market.updated_at,
      };
    }

    if (market) {
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
}
