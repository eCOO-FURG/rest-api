//Types
import { Optional } from "../types/optional";

//Entities
import { Entity, EntityRequest } from "./entity";
import { UUID } from "./value-objects/uuid";

export interface AgribusinessProps {
  name: string;
  caf: string;
  active: boolean;
  admin_id: UUID;
}

export class Agribusiness extends Entity<AgribusinessProps> {
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

  static create(props: Optional<AgribusinessProps, "active"> & EntityRequest) {
    const agribusiness = new Agribusiness({
      ...props,
      active: props.active ?? true,
    });
    return agribusiness;
  }
}
