// Entities
import { Order, OrderProps } from "@/core/entities/order";
import { OfferAndProduct } from "@/core/entities/aggregates/offer-and-product";

export interface OrderAndOfferProps extends OrderProps {
  offer: OfferAndProduct;
}

export class OrderAndOffer extends Order {
  get offer() {
    return this.props.offer;
  }

  static create(props: OrderAndOfferProps) {
    return new OrderAndOffer(props);
  }
}
