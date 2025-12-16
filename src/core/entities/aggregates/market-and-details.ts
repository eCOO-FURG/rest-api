// Entities
import { Market, MarketProps } from "@/core/entities/market";

export interface MarketAndDetailsProps extends MarketProps {
  offers_count: number;
  bags_count: number;
  revenue: number;
  fee: number;
}

export class MarketAndDetails extends Market<MarketAndDetailsProps> {
  get offers_count() {
    return this.props.offers_count;
  }

  get bags_count() {
    return this.props.bags_count;
  }

  get revenue() {
    return this.props.revenue;
  }

  get fee() {
    return this.props.fee;
  }

  static create(props: MarketAndDetailsProps) {
    return new MarketAndDetails(props);
  }
}
