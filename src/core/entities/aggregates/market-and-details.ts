// Entities
import { Market, MarketProps } from "@/core/entities/market";

export interface MarketAndDetailsProps extends MarketProps {
  offers_total: number;
  bags_total: number;
}

export class MarketAndDetails extends Market<MarketAndDetailsProps> {
  get offers_total() {
    return this.props.offers_total;
  }

  get bags_total() {
    return this.props.bags_total;
  }

  static create(props: MarketAndDetailsProps) {
    return new MarketAndDetails(props);
  }
}
