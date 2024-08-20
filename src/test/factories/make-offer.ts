// Entities
import { Offer } from "@/core/entities/offer";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libs
import { faker } from "@faker-js/faker";

export function makeOffer(props: Partial<Offer> = {}) {
  return Offer.create({
    id: props.id,
    farm_id: props.farm_id ?? new UUID(),
    cycle_id: props.cycle_id ?? new UUID(),
    product_id: props.product_id ?? new UUID(),
    amount: props.amount ?? faker.number.int({ min: 10, max: 12 }),
    price: props.price ?? faker.number.int({ min: 5, max: 50 }),
    description: props.description ?? null,
    created_at: props.created_at,
    updated_at: props.updated_at,
  });
}
