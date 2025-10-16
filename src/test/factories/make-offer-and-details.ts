// Entities
import { Offer } from "@/core/entities/offer";
import { OfferAndDetails } from "@/core/entities/aggregates/offer-and-details";

// Factories
import { makeOffer } from "@/test/factories/make-offer";
import { makeProduct } from "@/test/factories/make-product";
import { makeProducer } from "@/test/factories/make-producer";

export function makeOfferAndDetails(offer: Offer = makeOffer()) {
  return OfferAndDetails.create({
    ...offer.props,
    farm: makeProducer(offer.farm),
    product: offer.product ?? makeProduct(),
  });
}
