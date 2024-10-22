// Entities
import { Entity } from "@/core/entities/entity";
import { FarmProps } from "@/core/entities/farm";
import { User } from "@/core/entities/user";

export interface FarmAggregateProps extends Omit<FarmProps, "admin_id"> {
  admin: User;
}

export class FarmAggregate extends Entity<FarmAggregateProps> {
  get name() {
    return this.props.name;
  }

  get counterfoil_number() {
    return this.props.counterfoil_number;
  }

  get status() {
    return this.props.status;
  }

  get admin() {
    return this.props.admin;
  }

  get tax() {
    return this.props.tax;
  }

  static create(props: FarmAggregateProps) {
    const bag = new FarmAggregate(props);
    return bag;
  }
}
