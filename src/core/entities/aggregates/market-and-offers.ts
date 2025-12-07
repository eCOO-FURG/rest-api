// Entities
import { Market, MarketProps } from "@/core/entities/market";
import { Merchandise } from "@/core/entities/aggregates/merchandise";
import { Page } from "@/core/types/page";

export interface MarketAndOffersProps extends MarketProps {
  offers: Page<Merchandise>;
}

export class MarketAndOffers extends Market<MarketAndOffersProps> {
  get offers() {
    return this.props.offers;
  }

  static create(props: MarketAndOffersProps) {
    return new MarketAndOffers(props);
  }
}
