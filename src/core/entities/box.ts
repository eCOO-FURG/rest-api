// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";
import { Optional } from "@/core/types/optional";

export interface BoxProps extends EntityRequest {
  catalog_id: UUID;
  verified: number;
}

export class Box extends Entity<BoxProps> {
  get catalog_id() {
    return this.props.catalog_id;
  }

  get verified() {
    return this.props.verified;
  }

  set verified(value: number) {
    this.props.verified = value;
  }

  static create(props: Optional<BoxProps, "verified">) {
    const box = new Box({ ...props, verified: props.verified ?? 0 });
    return box;
  }
}
