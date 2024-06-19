// Entities
import { Order } from "@/core/entities/order";
import { UUID } from "@/core/entities/value-objects/uuid";

// Libs
import { faker } from "@faker-js/faker";

export function makeOrder(props: Partial<Order> = {}) {
  return Order.create({
    id: props.id,
    offer_id: props.offer_id ?? new UUID(),
    user_id: props.user_id ?? new UUID(),
    amount: props.amount ?? faker.number.int({ min: 10, max: 12 }),
    created_at: props.created_at,
    updated_at: props.updated_at,
  });
}
