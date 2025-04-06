// Entities
import { Order, OrderProps } from "@/core/entities/order";
import { OfferAndProduct } from "@/core/entities/aggregates/offer-and-product";

export interface OrderAndDetailsProps extends OrderProps {
  offer: OfferAndProduct;
}

export class OrderAndOffer extends Order {
  get offer() {
    return this.props.offer;
  }

  static create(props: OrderAndDetailsProps) {
    return new OrderAndOffer(props);
  }
}
