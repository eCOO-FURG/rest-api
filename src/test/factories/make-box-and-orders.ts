// Entities
import { Box } from "@/core/entities/box";
import { BoxAndOrders } from "@/core/entities/aggregates/box-and-orders";

// Factories
import { makeBox } from "@/test/factories/make-box";
import { makeOrderAndOffer } from "@/test/factories/make-order-and-offer";
import { makeProducer } from "@/test/factories/make-producer";

export function makeBoxAndOrders(box: Box = makeBox()) {
  return BoxAndOrders.create({
    ...box.props,
    farm: makeProducer(box.farm),
    orders: [makeOrderAndOffer()],
  });
}
