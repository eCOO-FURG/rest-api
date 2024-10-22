// Entities
import { Entity } from "@/core/entities/entity";
import { BagAggregateProps } from "@/core/entities/aggregates/bag-aggregate";
import { OrderMerge } from "@/core/entities/merged/order-merge";
import { Payment } from "@/core/entities/payment";

interface BagMergeProps extends BagAggregateProps {
  orders: OrderMerge[];
  payments: Payment[];
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

  paid() {
    const payments = this.props.payments;

    const done = payments.some((payment) => payment.status === "DONE");

    return done;
  }

  open() {
    const payments = this.props.payments;

    const pending = payments.find(
      (payment) => payment.status === "PENDING" && !payment.expired
    );

    if (!pending) return null;

    return pending;
  }

  static create(props: BagMergeProps) {
    const bag = new BagMerge(props);
    return bag;
  }
}
