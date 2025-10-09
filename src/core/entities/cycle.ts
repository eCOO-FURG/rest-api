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

  static create({ offer, order, deliver, ...props }: CycleProps) {
    return new Cycle({
      ...props,
      offer: this.sort(offer),
      order: this.sort(order),
      deliver: this.sort(deliver),
    });
  }

  static sort(days: CycleWeek) {
    days.sort((a, b) => a - b);

    const min = Math.min(...days);
    const max = Math.max(...days);

    const merge = max === 7 && min === 1 && days.length !== 7;

    if (!merge) return days;

    let intervals = 0;

    for (const [index, day] of days.entries()) {
      const next = days[index + 1];

      if (!next) continue;

      if (next != day + 1) {
        intervals++;
      }
    }

    if (intervals !== 1) return days;

    const interval = days.findIndex((day, index) => days.at(index + 1) !== day + 1);

    return [...days.slice(interval + 1), ...days.slice(0, interval + 1)];
  }

  static Week = [1, 2, 3, 4, 5, 6, 7] as const;
}
