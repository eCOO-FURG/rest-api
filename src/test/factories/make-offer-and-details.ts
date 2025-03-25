// Entities
import { Offer } from "@/core/entities/offer";
import { OfferAndDetails } from "@/core/entities/aggregates/offer-and-details";

// Factories
import { makeCatalogAndFarm } from "@/test/factories/make-farm-and-catalog";
import { makeOffer } from "@/test/factories/make-offer";
import { makeProduct } from "@/test/factories/make-product";

export function makeOfferAndDetails(offer: Offer = makeOffer()) {
  return OfferAndDetails.create({
    ...offer.props,
    catalog: makeCatalogAndFarm(offer.catalog),
    product: offer.product ?? makeProduct(),
  });
}
