import { Farm } from "@/core/entities/farm";
import { UUID } from "@/core/entities/aggregates/uuid";
import { faker } from "@faker-js/faker";

export function makeFarm(props: Partial<Farm> = {}) {
  return Farm.create({
    id: props.id,
    admin_id: props.admin_id ?? new UUID(),
    name: props.name ?? faker.company.name(),
    caf: props.caf ?? faker.number.bigInt().toString(),
    active: props.active ?? true,
    tax: props.tax,
    created_at: props.created_at,
    updated_at: props.updated_at,
  });
}
