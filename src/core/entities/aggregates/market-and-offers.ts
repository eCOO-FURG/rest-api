// Entities
import { Market, MarketProps } from "@/core/entities/market";
import { Merchandise } from "@/core/entities/aggregates/merchandise";

export interface MarketAndOffersProps extends MarketProps {
  offers: Merchandise[];
}

export class MarketAndOffers extends Market<MarketAndOffersProps> {
  get offers() {
    return this.props.offers;
  }

  static create(props: MarketAndOffersProps) {
    return new MarketAndOffers(props);
  }
}
