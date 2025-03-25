// Entities
import { Order, OrderProps } from "@/core/entities/order";
import { OfferAndDetails } from "@/core/entities/aggregates/offer-and-details";

export interface OrderAndOfferProps extends OrderProps {
  offer: OfferAndDetails;
}

export class OrderAndOffer extends Order {
  get offer() {
    return this.props.offer;
  }

  static create(props: OrderAndOfferProps) {
    return new OrderAndOffer(props);
  }
}
