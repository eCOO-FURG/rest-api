// Entities
import { BagProps } from "@/core/entities/bag";
import { Entity } from "@/core/entities/entity";
import { User } from "@/core/entities/user";
import { Address } from "@/core/entities/address";

export interface BagAggregateProps
  extends Omit<BagProps, "user_id" | "address_id"> {
  user: User;
  address: Address | null;
}

export class BagAggregate extends Entity<BagAggregateProps> {
  get user() {
    return this.props.user;
  }

  get address() {
    return this.props.address;
  }

  get cycle_id() {
    return this.props.cycle_id;
  }

  get status() {
    return this.props.status;
  }

  static create(props: BagAggregateProps) {
    const bag = new BagAggregate(props);
    return bag;
  }
}
