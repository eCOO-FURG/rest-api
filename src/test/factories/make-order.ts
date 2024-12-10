// Entities
import { Order } from "@/core/entities/order";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libs
import { faker } from "@faker-js/faker";

export function makeOrder(props: Partial<Order> = {}) {
  return Order.create({
    ...props,
    offer_id: props.offer_id ?? new UUID(),
    bag_id: props.bag_id ?? new UUID(),
    amount: props.amount ?? faker.number.int({ min: 10, max: 12 }),
    box_id: props.box_id ?? new UUID(),
  });
}
