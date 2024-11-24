// Types
import { Optional } from "@/core/types/optional";

// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";

export interface FarmProps extends EntityRequest {
  name: string;
  tally: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  admin_id: UUID;
  tax: number;
  description: string | null;
  image: string | null;
}

export class Farm extends Entity<FarmProps> {
  get name() {
    return this.props.name;
  }

  get tally() {
    return this.props.tally;
  }

  get status() {
    return this.props.status;
  }

  get admin_id() {
    return this.props.admin_id;
  }

  get description(): string | null {
    return this.props.description;
  }

  get image(): string | null {
    return this.props.image;
  }

  set description(value: string) {
    this.props.description = value;
  }

  set name(value: string) {
    this.props.name = value;
  }

  set tally(value: string) {
    this.props.tally = value;
  }

  set status(status: "ACTIVE" | "INACTIVE" | "PENDING") {
    this.props.status = status;
  }

  set image(value: string) {
    this.props.image = value;
  }

  get tax() {
    return this.props.tax;
  }

  static create(
    props: Optional<FarmProps, "status" | "tax" | "description" | "image">
  ) {
    const farm = new Farm({
      ...props,
      status: props.status ?? "PENDING",
      tax: props.tax ?? 20,
      description: props.description ?? null,
      image: props.image ?? null,
    });
    return farm;
  }
}
