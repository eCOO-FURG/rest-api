// Entities
import { BagProps } from "@/core/entities/bag";
import { Entity } from "@/core/entities/entity";
import { User } from "@/core/entities/user";

export interface BagAggregateProps extends Omit<BagProps, "user_id"> {
  user: User;
}

export class BagAggregate extends Entity<BagAggregateProps> {
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

  static create(props: BagAggregateProps) {
    const bag = new BagAggregate(props);
    return bag;
  }
}
