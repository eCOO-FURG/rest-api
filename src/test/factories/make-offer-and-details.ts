// Entities
import { Offer } from "@/core/entities/offer";
import { OfferAndDetails } from "@/core/entities/aggregates/offer-and-details";

// Factories
import { makeOffer } from "@/test/factories/make-offer";
import { makeProduct } from "@/test/factories/make-product";
import { makeFarmAndAdmin } from "@/test/factories/make-farm-and-admin";

export function makeOfferAndDetails(offer: Offer = makeOffer()) {
  return OfferAndDetails.create({
    ...offer.props,
    farm: makeFarmAndAdmin(offer.farm),
    product: offer.product ?? makeProduct(),
  });
}
