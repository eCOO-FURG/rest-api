// Entities
import { CatalogMerge } from "@/core/entities/merged/catalog-merge";

// Presenters
import { FarmPresenter } from "@/infra/http/presenters/farm-presenter";

export class CatalogPresenter {
  static toHttp(catalog: CatalogMerge) {
    return {
      id: catalog.id.value,
      cycle_id: catalog.cycle_id.value,
      farm: FarmPresenter.toHttp(catalog.farm),
      created_at: catalog.created_at,
      updated_at: catalog.updated_at,
    };
  }
}
