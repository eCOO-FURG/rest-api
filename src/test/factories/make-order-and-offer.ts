// Entities
import { Order } from "@/core/entities/order";
import { OrderAndOffer } from "@/core/entities/aggregates/order-and-offer";

// Factories
import { makeOrder } from "@/test/factories/make-order";
import { makeOfferAndDetails } from "@/test/factories/make-offer-and-details";

export function makeOrderAndOffer(order: Order = makeOrder()) {
  return OrderAndOffer.create({
    ...order.props,
    offer: makeOfferAndDetails(order.offer),
  });
}
