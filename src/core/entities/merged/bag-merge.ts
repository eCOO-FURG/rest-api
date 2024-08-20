// Entities
import { Entity } from "@/core/entities/entity";
import { BagAggregateProps } from "@/core/entities/aggregates/bag-aggregate";
import { OrderAggregate } from "@/core/entities/aggregates/order-aggregate";

interface BagMergeProps extends BagAggregateProps {
  orders: OrderAggregate[];
}

export class BagMerge extends Entity<BagMergeProps> {
  get user() {
    return this.props.user;
  }

  get cycle_id() {
    return this.props.cycle_id;
  }

  get status() {
    return this.props.status;
  }

  get address() {
    return this.props.address;
  }

  get orders() {
    return this.props.orders;
  }

  price() {
    const orders = this.props.orders;

    let price = 0;

    for (const order of orders) price += order.amount * order.offer.price;

    return price;
  }

  static create(props: BagMergeProps) {
    const bag = new BagMerge(props);
    return bag;
  }
}
