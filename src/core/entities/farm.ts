// Types
import { Optional } from "@/core/types/optional";

// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/value-objects/uuid";

export interface FarmProps {
  name: string;
  caf: string;
  active: boolean;
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

  get active() {
    return this.props.active;
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

  set active(active: boolean) {
    this.props.active = active;
  }

  get tax() {
    return this.props.tax;
  }

  static create(props: Optional<FarmProps, "active" | "tax"> & EntityRequest) {
    const farm = new Farm({
      ...props,
      active: props.active ?? true,
      tax: props.tax ?? 20,
    });
    return farm;
  }
}
