// Entities
import { Cycle } from "@/core/entities/cycle";

export class CyclePresenter {
  static toHttp(cycle: Cycle) {
    return {
      id: cycle.id.value,
      alias: cycle.alias,
      offer: cycle.offer,
      order: cycle.order,
      deliver: cycle.deliver,
      createdAt: cycle.created_at,
      updatedAt: cycle.updated_at,
    };
  }
}
