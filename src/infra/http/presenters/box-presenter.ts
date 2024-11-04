// Entities
import { BoxAggregate } from "@/core/entities/aggregates/box-aggregate";

// Presenters
import { CatalogPresenter } from "@/infra/http/presenters/catalog-presenter";

export class BoxPresenter {
  static toHttp(box: BoxAggregate) {
    return {
      id: box.id.value,
      verified: box.verified,
      catalog: CatalogPresenter.toHttp(box.catalog),
      created_at: box.created_at,
      updated_at: box.updated_at,
    };
  }
}
