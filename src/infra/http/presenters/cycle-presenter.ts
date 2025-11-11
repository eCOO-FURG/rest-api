// Entities
import { Cycle, CycleProps } from "@/core/entities/cycle";

// Types
import { View } from "@/infra/types/view";

export class CyclePresenter {
  static toHttp(cycle?: Cycle): View<CycleProps> {
    if (cycle) {
      return {
        id: cycle.id.value,
        alias: cycle.alias,
        offer: cycle.offer,
        order: cycle.order,
        deliver: cycle.deliver,
        created_at: cycle.created_at,
        updated_at: cycle.updated_at,
      };
    }
  }
}
