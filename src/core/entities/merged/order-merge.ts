// Entities
import { Entity } from "@/core/entities/entity";
import { OfferMerge } from "@/core/entities/merged/offer-merge";
import { Order } from "@/core/entities/order";
import { OrderAggregateProps } from "@/core/entities/aggregates/order-aggregate";

export interface OrderMergeProps extends Omit<OrderAggregateProps, "offer"> {
  offer: OfferMerge;
}

export class OrderMerge extends Entity<OrderMergeProps> {
  get box_id() {
    return this.props.box_id;
  }

  get bag_id() {
    return this.props.bag_id;
  }

  get amount() {
    return this.props.amount;
  }

  get status() {
    return this.props.status;
  }

  set status(value: Order["status"]) {
    this.props.status = value;
  }

  get offer() {
    return this.props.offer;
  }

  static create(props: OrderMergeProps) {
    const order = new OrderMerge(props);
    return order;
  }
}
