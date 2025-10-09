// Entities
import { Box } from "@/core/entities/box";
import { BoxAndOrders } from "@/core/entities/aggregates/box-and-orders";

// Factories
import { makeBox } from "@/test/factories/make-box";
import { makeOrderAndOffer } from "@/test/factories/make-order-and-offer";
import { makeFarmAndAdmin } from "@/test/factories/make-farm-and-admin";

export function makeBoxAndOrders(box: Box = makeBox()) {
  return BoxAndOrders.create({
    ...box.props,
    farm: makeFarmAndAdmin(box.farm),
    orders: [makeOrderAndOffer()],
  });
}
