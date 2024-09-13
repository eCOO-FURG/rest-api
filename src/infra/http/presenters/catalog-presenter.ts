// Entities
import { CatalogAggregate } from "@/core/entities/aggregates/catalog-aggregate";
import { CatalogMerge } from "@/core/entities/merged/catalog-merge";

// Presenters
import { FarmPresenter } from "@/infra/http/presenters/farm-presenter";
import { OfferPresenter } from "@/infra/http/presenters/offer-presenter";

export class CatalogPresenter {
  static toHttpMerge(catalog: CatalogMerge) {
    return {
      id: catalog.id.value,
      cycle_id: catalog.cycle_id.value,
      farm: FarmPresenter.toHttp(catalog.farm),
      offers: catalog.offers.map((offer) => OfferPresenter.toHttp(offer)),
      created_at: catalog.created_at,
      updated_at: catalog.updated_at,
    };
  }

  static toHttpAggregate(catalog: CatalogAggregate) {
    return {
      id: catalog.id.value,
      cycle_id: catalog.cycle_id.value,
      farm: FarmPresenter.toHttp(catalog.farm),
      created_at: catalog.created_at,
      updated_at: catalog.updated_at,
    };
  }

  static toHttp(catalog: CatalogAggregate | CatalogMerge) {
    switch (typeof catalog) {
      case (typeof CatalogMerge):
        return this.toHttpMerge(catalog as CatalogMerge);
      case (typeof CatalogAggregate):
        return this.toHttpAggregate(catalog as CatalogAggregate);
    }
  }
}
