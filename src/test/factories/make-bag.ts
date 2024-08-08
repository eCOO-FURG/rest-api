// Entities
import { Bag } from "@/core/entities/bag";
import { UUID } from "@/core/entities/value-objects/uuid";

// Libs
import { faker } from "@faker-js/faker";

export function makeBag(props: Partial<Bag> = {}) {
  const bag = Bag.create({
    id: props.id,
    user_id: props.user_id ?? new UUID(),
    cycle_id: props.cycle_id ?? new UUID(),
    status: props.status,
    created_at: props.created_at,
    updated_at: props.updated_at,
    address: props.address ?? faker.location.streetAddress(),
  });

  return bag;
}
