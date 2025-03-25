// Entities
import { User } from "@/core/entities/user";
import { Bag, BagProps } from "@/core/entities/bag";
import { Address } from "@/core/entities/address";
import { Payment } from "@/core/entities/payment";

// Types
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

  get payment() {
    return this.props.payment;
  }

  get paid() {
    return this.props.payment?.status === "DONE";
  }

  static create(props: Optional<BagAndDetailsProps, "orders">) {
    return new BagAndDetails({
      ...props,
      orders: props.orders ?? [],
    });
  }
}
