//Types
import { Optional } from "../types/optional";

//Entities
import { Entity, EntityRequest } from "./entity";
import { UUID } from "./value-objects/uuid";

export interface FarmProps {
  name: string;
  caf: string;
  active: boolean;
  admin_id: UUID;
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

  static create(props: Optional<FarmProps, "active"> & EntityRequest) {
    const farm = new Farm({
      ...props,
      active: props.active ?? true,
    });
    return farm;
  }
}
