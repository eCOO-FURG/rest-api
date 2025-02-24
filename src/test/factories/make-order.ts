// Entities
import { Order } from "@/core/entities/order";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { faker } from "@faker-js/faker";

export function makeOrder(props: Partial<Order> = {}) {
  return Order.create({
    ...props,
    offer_id: props.offer_id ?? new UUID(),
    bag_id: props.bag_id ?? new UUID(),
    box_id: props.box_id ?? new UUID(),
    tax: props.tax ?? faker.number.int({ min: 1, max: 100 }),
    amount: props.amount ?? faker.number.int({ min: 10, max: 12 }),
  });
}
