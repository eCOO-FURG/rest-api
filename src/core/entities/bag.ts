// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";

// Types
import { Optional } from "@/core/types/optional";

export interface BagProps extends EntityRequest {
  code: string;
  user_id: UUID;
  cycle_id: UUID;
  address_id: UUID | null;
  status:
    | "PENDING"
    | "SEPARATED"
    | "DISPATCHED"
    | "RECEIVED"
    | "CANCELLED"
    | "DEFERRED";
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

  get address_id() {
    return this.props.address_id;
  }

  set status(value: BagProps["status"]) {
    this.props.status = value;
  }

  get code() {
    return this.props.code;
  }

  static create(props: Optional<BagProps, "status" | "address_id">) {
    const bag = new Bag({
      ...props,
      status: props.status ?? "PENDING",
      address_id: props.address_id ?? null,
    });

    return bag;
  }
}
