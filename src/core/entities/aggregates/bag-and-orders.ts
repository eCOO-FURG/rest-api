// Entities
import { User } from "@/core/entities/user";
import { Bag, BagProps } from "@/core/entities/bag";
import { Address } from "@/core/entities/address";
import { Payment } from "@/core/entities/payment";
import { OrderAndDetails } from "@/core/entities/aggregates/order-and-details";

// Types
import { Optional } from "@/core/types/optional";

export interface BagAndOrdersProps extends BagProps {
  customer: User;
  address: Address | null;
  payment: Payment | null;
  orders: OrderAndDetails[];
}

export class BagAndOrders extends Bag<BagAndOrdersProps> {
  get customer() {
    return this.props.customer;
  }

  get address() {
    return this.props.address;
  }

  get payment() {
    return this.props.payment;
  }

  get orders() {
    return this.props.orders;
  }

  get paid() {
    return this.props.payment?.status === "DONE";
  }

  static create(props: Optional<BagAndOrdersProps, "orders">) {
    return new BagAndOrders({
      ...props,
      orders: props.orders ?? [],
    });
  }
}
