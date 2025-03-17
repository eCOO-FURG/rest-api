// Entities
import { Catalog, CatalogProps } from "@/core/entities/catalog";

// Presenters
import { CyclePresenter } from "@/infra/http/presenters/cycle-presenter";
import { FarmPresenter } from "@/infra/http/presenters/farm-presenter";
import { OfferPresenter } from "@/infra/http/presenters/offer-presenter";

import { View } from "@/infra/types/view";

export class CatalogPresenter {
  static toHttp(catalog?: Catalog): View<CatalogProps> {
    if (catalog)
      return {
        id: catalog.id.value,
        tax: catalog.tax,
        cycle_id: catalog.cycle_id.value,
        cycle: CyclePresenter.toHttp(catalog.cycle),
        farm_id: catalog.farm_id.value,
        farm: FarmPresenter.toHttp(catalog.farm),
        offers: catalog.offers.map(OfferPresenter.toHttp),
        created_at: catalog.created_at,
        updated_at: catalog.updated_at,
      };
  }
}
