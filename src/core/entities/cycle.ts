// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";

export type Week = (1 | 2 | 3 | 4 | 5 | 6 | 7)[];

export interface CycleProps {
  alias: string;
  offer: Week;
  order: Week;
  deliver: Week;
}

export class Cycle extends Entity<CycleProps> {
  get alias() {
    return this.props.alias;
  }

  get offer() {
    return this.props.offer;
  }

  get order() {
    return this.props.order;
  }

  get deliver() {
    return this.props.deliver;
  }

  static create(props: CycleProps & EntityRequest) {
    const cycle = new Cycle(props);
    return cycle;
  }
}
