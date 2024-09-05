// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";
import { Optional } from "@/core/types/optional";

export interface BoxProps extends EntityRequest {
  catalog_id: UUID;
  status: "PENDING" | "VERIFIED";
}

export class Box extends Entity<BoxProps> {
  get catalog_id() {
    return this.props.catalog_id;
  }

  get status() {
    return this.props.status;
  }

  set status(value: "PENDING" | "VERIFIED") {
    this.props.status = value;
  }

  static create(props: Optional<BoxProps, "status">) {
    const box = new Box({ ...props, status: props.status ?? "PENDING" });
    return box;
  }
}
