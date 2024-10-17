// Types
import { Optional } from "@/core/types/optional";

// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";

export interface FarmProps extends EntityRequest {
  name: string;
  caf: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  admin_id: UUID;
  tax: number;
}

export class Farm extends Entity<FarmProps> {
  get name() {
    return this.props.name;
  }

  get caf() {
    return this.props.caf;
  }

  get status() {
    return this.props.status;
  }

  get admin_id() {
    return this.props.admin_id;
  }

  set name(value: string) {
    this.props.name = value;
  }

  set caf(value: string) {
    this.props.caf = value;
  }

  set status(status: "ACTIVE" | "INACTIVE" | "PENDING") {
    this.props.status = status;
  }

  get tax() {
    return this.props.tax;
  }

  static create(props: Optional<FarmProps, "status" | "tax">) {
    const farm = new Farm({
      ...props,
      status: props.status ?? "ACTIVE",
      tax: props.tax ?? 20,
    });
    return farm;
  }
}
