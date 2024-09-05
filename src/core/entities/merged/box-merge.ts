// Entities
import { OrderAggregate } from "@/core/entities/aggregates/order-aggregate";
import { Entity } from "@/core/entities/entity";
import { BoxAggregateProps } from "@/core/entities/aggregates/box-aggregate";
import { Box } from "@/core/entities/box";

interface BoxMergeProps extends BoxAggregateProps {
  orders: OrderAggregate[];
}

export class BoxMerge extends Entity<BoxMergeProps> {
  get catalog() {
    return this.props.catalog;
  }

  get status() {
    return this.props.status;
  }

  set status(value: Box["status"]) {
    this.props.status = value;
  }

  get orders() {
    return this.props.orders;
  }

  static create(props: BoxMergeProps) {
    const box = new BoxMerge(props);
    return box;
  }
}
