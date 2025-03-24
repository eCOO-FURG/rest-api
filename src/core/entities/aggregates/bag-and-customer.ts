// Entities
import { User } from "@/core/entities/user";
import { Bag, BagProps } from "@/core/entities/bag";
import { Address } from "@/core/entities/address";

// Types
import { Optional } from "@/core/types/optional";

export interface BagAndCustomerProps extends BagProps {
  customer: User;
  address: Address | null;
}

export class BagAndCustomer extends Bag<BagAndCustomerProps> {
  get customer() {
    return this.props.customer;
  }

  get address() {
    return this.props.address;
  }

  static create(props: Optional<BagAndCustomerProps, "orders" | "payments">) {
    return new BagAndCustomer({
      ...props,
      orders: props.orders ?? [],
      payments: props.payments ?? [],
    });
  }
}
