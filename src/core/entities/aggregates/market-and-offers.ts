// Entities
import { Market, MarketProps } from "@/core/entities/market";
import { OfferAndDetails } from "@/core/entities/aggregates/offer-and-details";

export interface MarketAndOffersProps extends MarketProps {
  offers: OfferAndDetails[];
}

export class MarketAndOffers extends Market<MarketAndOffersProps> {
  get offers() {
    return this.props.offers;
  }

  static create(props: MarketAndOffersProps) {
    return new MarketAndOffers(props);
  }
}
