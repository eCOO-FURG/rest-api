// Entities
import { Order, OrderProps } from "@/core/entities/order";
import { OfferAndDetails } from "@/core/entities/aggregates/offer-and-details";

export interface OrderAndDetailsProps extends OrderProps {
  offer: OfferAndDetails;
}

export class OrderAndDetails extends Order {
  get offer() {
    return this.props.offer;
  }

  static create(props: OrderAndDetailsProps) {
    return new OrderAndDetails(props);
  }
}
