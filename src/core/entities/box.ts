// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";

// Types
import { Optional } from "@/core/types/optional";

export interface BoxProps extends EntityRequest {
  catalog_id: UUID;
  status: "PENDING" | "VERIFIED";
  verified: number;
}

export class Box extends Entity<BoxProps> {
  get catalog_id() {
    return this.props.catalog_id;
  }

  get verified() {
    return this.props.verified;
  }

  get status() {
    return this.props.status;
  }

  set status(value: BoxProps["status"]) {
    this.props.status = value;
  }

  set verified(value: number) {
    this.props.verified = value;
  }

  static create(props: Optional<BoxProps, "verified" | "status">) {
    const box = new Box({
      ...props,
      verified: props.verified ?? 0,
      status: props.status ?? "PENDING",
    });
    return box;
  }
}
