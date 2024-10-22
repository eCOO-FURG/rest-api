// Types
import { Optional } from "@/core/types/optional";

// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";

export interface FarmProps extends EntityRequest {
  name: string;
  counterfoil_number: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  admin_id: UUID;
  tax: number;
  description: string;
}

export class Farm extends Entity<FarmProps> {
  get name() {
    return this.props.name;
  }

  get counterfoil_number() {
    return this.props.counterfoil_number;
  }

  get status() {
    return this.props.status;
  }

  get admin_id() {
    return this.props.admin_id;
  }

  get description() {
    return this.props.description;
  }

  set description(value: string) { 
    this.props.description = value;
  }

  set name(value: string) {
    this.props.name = value;
  }

  set counterfoil_number(value: string) {
    this.props.counterfoil_number = value;
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
      status: props.status ?? "PENDING",
      tax: props.tax ?? 20,
    });
    return farm;
  }
}
