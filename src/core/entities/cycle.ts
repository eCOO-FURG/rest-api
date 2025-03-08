// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";

export type CycleWeek = (typeof Cycle.Week)[number][];

export interface CycleProps extends EntityRequest {
  alias: string;
  offer: CycleWeek;
  order: CycleWeek;
  deliver: CycleWeek;
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

  static create(props: CycleProps) {
    const cycle = new Cycle(props);
    return cycle;
  }

  static Week = [1, 2, 3, 4, 5, 6, 7] as const;
}
