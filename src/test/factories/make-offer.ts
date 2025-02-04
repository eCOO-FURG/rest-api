// Entities
import { Offer } from "@/core/entities/offer";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { faker } from "@faker-js/faker";

export function makeOffer(props: Partial<Offer> = {}) {
  return Offer.create({
    ...props,
    product_id: props.product_id ?? new UUID(),
    catalog_id: props.catalog_id ?? new UUID(),
    amount: props.amount ?? faker.number.int({ min: 10, max: 12 }),
    price: props.price ?? faker.number.int({ min: 5, max: 50 }),
  });
}
