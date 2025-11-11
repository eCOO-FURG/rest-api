// Entities
import { User } from "@/core/entities/user";
import { Bag, BagProps } from "@/core/entities/bag";
import { Address } from "@/core/entities/address";
import { Payment } from "@/core/entities/payment";
import { Optional } from "@/core/types/optional";

export interface BagAndDetailsProps extends BagProps {
  customer: User;
  address: Address | null;
  payment: Payment | null;
}

export class BagAndDetails extends Bag<BagAndDetailsProps> {
  get customer() {
    return this.props.customer;
  }

  get address() {
    return this.props.address;
  }

  get paid() {
    return this.props.payment?.status === "DONE";
  }

  get payment() {
    return this.props.payment;
  }

  set payment(payment: Payment | null) {
    this.props.payment = payment;
  }

  static create(props: Optional<BagAndDetailsProps, "orders">) {
    return new BagAndDetails({
      ...props,
      orders: props.orders ?? [],
    });
  }
}
