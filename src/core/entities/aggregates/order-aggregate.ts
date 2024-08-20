// Entities
import { Entity } from "@/core/entities/entity";
import { OrderProps } from "@/core/entities/order";
import { OfferAggregate } from "@/core/entities/aggregates/offer-aggregate";

interface OrderAggregateProps extends Omit<OrderProps, "offer_id"> {
  offer: OfferAggregate;
}

export class OrderAggregate extends Entity<OrderAggregateProps> {
  get bag_id() {
    return this.props.bag_id;
  }

  get amount() {
    return this.props.amount;
  }

  get status() {
    return this.props.status;
  }

  get offer() {
    return this.props.offer;
  }

  static create(props: OrderAggregateProps) {
    const order = new OrderAggregate(props);
    return order;
  }
}
