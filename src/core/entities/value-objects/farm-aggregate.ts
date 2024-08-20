// Entities
import { Entity } from "@/core/entities/entity";
import { FarmProps } from "@/core/entities/farm";
import { User } from "@/core/entities/user";

interface FarmAggregateProps extends Omit<FarmProps, "admin_id"> {
  admin: User;
}
export class FarmAggregate extends Entity<FarmAggregateProps> {
  get admin() {
    return this.props.admin;
  }

  get name() {
    return this.props.name;
  }

  get caf() {
    return this.props.caf;
  }

  get active() {
    return this.props.active;
  }

  static create(props: FarmAggregateProps) {
    const farm = new FarmAggregate(props);
    return farm;
  }
}
