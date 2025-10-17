// Entities
import { Offer } from "@/core/entities/offer";
import { Merchandise } from "@/core/entities/aggregates/merchandise";

// Factories
import { makeOffer } from "@/test/factories/make-offer";
import { makeProduct } from "@/test/factories/make-product";
import { makeProducer } from "@/test/factories/make-producer";

export function makeMerchandise(offer: Offer = makeOffer()) {
  return Merchandise.create({
    ...offer.props,
    farm: makeProducer(offer.farm),
    product: offer.product ?? makeProduct(),
  });
}
