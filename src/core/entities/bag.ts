// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/value-objects/uuid";

// Types
import { Optional } from "@/core/types/optional";

export interface BagProps extends EntityRequest {
  user_id: UUID;
  cycle_id: UUID;
  status: "PENDING" | "SEPARATED" | "DISPATCHED";
  address: string;
}

export class Bag extends Entity<BagProps> {
  get user_id() {
    return this.props.user_id;
  }

  get cycle_id() {
    return this.props.cycle_id;
  }

  get status() {
    return this.props.status;
  }

  set status(value: "PENDING" | "SEPARATED" | "DISPATCHED") {
    this.props.status = value;
  }

  static create(props: Optional<BagProps, "status">) {
    const bag = new Bag({
      ...props,
      status: props.status ?? "PENDING",
    });

    return bag;
  }
}
