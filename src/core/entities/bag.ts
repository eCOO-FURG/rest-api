// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";

// Types
import { Optional } from "@/core/types/optional";
import { BagStatus } from "@/core/types/bag-status";

export interface BagProps extends EntityRequest {
  user_id: UUID;
  cycle_id: UUID;
  status: BagStatus;
  address_id: UUID | null;
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

  static create(props: Optional<BagProps, "status" | "address_id">) {
    const bag = new Bag({
      ...props,
      status: props.status ?? "PENDING",
      address_id: props.address_id ?? null,
    });

    return bag;
  }
}
