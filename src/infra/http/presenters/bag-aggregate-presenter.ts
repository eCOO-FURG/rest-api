// Entities
import { BagAggregate } from "@/core/entities/aggregates/bag-aggregate";

// Presenters
import { UserPresenter } from "@/infra/http/presenters/user-presenter";

export class BagAggregatePresenter {
  static toHttp(bag: BagAggregate) {
    return {
      id: bag.id.value,
      status: bag.status,
      cycle_id: bag.cycle_id.value,
      address: bag.address,
      user: UserPresenter.toHttp(bag.user),
      created_at: bag.created_at,
      updated_at: bag.updated_at,
    };
  }
}
