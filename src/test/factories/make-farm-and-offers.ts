import { FarmAndOffers } from "@/core/entities/aggregates/farm-and-offers";
import { makeFarmAndAdmin } from "./make-farm-and-admin";
import { makeOfferAndDetails } from "./make-offer-and-details";

export function makeFarmAndOffers(farm = makeFarmAndAdmin()) {
  return FarmAndOffers.create({
    ...farm.props,
    offers: [makeOfferAndDetails()],
  });
}
