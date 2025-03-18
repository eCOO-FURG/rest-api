// Entities
import { Farm, FarmProps } from "@/core/entities/farm";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { faker } from "@faker-js/faker";

export function makeFarm(props: Partial<FarmProps> = {}) {
  return Farm.create({
    ...props,
    admin_id: props.admin_id ?? new UUID(),
    name: props.name ?? faker.company.name(),
    tally: props.tally ?? faker.number.int().toString(),
  });
}
