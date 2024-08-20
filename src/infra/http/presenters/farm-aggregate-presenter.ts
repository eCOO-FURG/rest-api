// Entities
import { FarmAggregate } from "@/core/entities/value-objects/farm-aggregate";

// Presenters
import { UserPresenter } from "@/infra/http/presenters/user-presenter";

export class FarmAggregatePresenter {
  static toHttp(farm: FarmAggregate) {
    return {
      name: farm.name,
      caf: farm.caf,
      active: farm.active,
      admin: UserPresenter.toHttp(farm.admin),
      created_at: farm.created_at,
      updated_at: farm.updated_at,
    };
  }
}
