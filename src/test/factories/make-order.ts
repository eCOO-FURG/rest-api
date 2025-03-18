// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Order, OrderProps } from "@/core/entities/order";

// Libraries
import { faker } from "@faker-js/faker";

export function makeOrder(props: Partial<OrderProps> = {}) {
  return Order.create({
    ...props,
    offer_id: props.offer_id ?? new UUID(),
    bag_id: props.bag_id ?? new UUID(),
    box_id: props.box_id ?? new UUID(),
    fee: props.fee ?? 0,
    amount: props.amount ?? faker.number.int({ min: 10, max: 12 }),
    price: props.price ?? faker.number.int({ min: 10, max: 12 }),
  });
}
