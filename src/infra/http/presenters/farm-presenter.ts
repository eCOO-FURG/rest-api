// Entities
import { FarmAggregate } from "@/core/entities/aggregates/farm-aggregate";

// Presenters
import { UserPresenter } from "@/infra/http/presenters/user-presenter";

export class FarmPresenter {
  static toHttp(farm: FarmAggregate) {
    const { roles, verified_at, ...admin } = UserPresenter.toHttp(farm.admin);

    return {
      id: farm.id.value,
      name: farm.name,
      caf: farm.caf,
      status: farm.status,
      tax: farm.tax,
      admin,
      created_at: farm.created_at,
      updated_at: farm.updated_at,
    };
  }
}
