// Entities
import { Cycle } from "@/core/entities/cycle";

// Libs
import { faker } from "@faker-js/faker";

export function makeCycle(props: Partial<Cycle> = {}) {
  return Cycle.create({
    id: props.id,
    alias:
      props.alias ??
      faker.date.month({
        abbreviated: true,
      }),
    offer: props.offer ?? [1, 2, 3, 4, 5, 6, 7],
    order: props.order ?? [1, 2, 3, 4, 5, 6, 7],
    deliver: props.deliver ?? [1, 2, 3, 4, 5, 6, 7],
    created_at: props.created_at,
    updated_at: props.updated_at,
  });
}
