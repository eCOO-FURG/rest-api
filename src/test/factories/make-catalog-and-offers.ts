// Entities
import { Catalog } from "@/core/entities/catalog";
import { CatalogAndOffers } from "@/core/entities/aggregates/catalog-and-offers";

// Factories
import { makeFarmAndAdmin } from "./make-farm-and-admin";
import { makeOfferAndDetails } from "./make-offer-and-details";
import { makeCatalog } from "@/test/factories/make-catalog";

export function makeCatalogAndOffers(catalog: Catalog = makeCatalog()) {
  return CatalogAndOffers.create({
    ...catalog.props,
    farm: makeFarmAndAdmin(),
    offers: [makeOfferAndDetails()],
  });
}
