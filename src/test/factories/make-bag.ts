// Entities
import { Bag } from "@/core/entities/bag";
import { UUID } from "@/core/entities/aggregates/uuid";

export function makeBag(props: Partial<Bag> = {}) {
  const bag = Bag.create({
    id: props.id,
    user_id: props.user_id ?? new UUID(),
    cycle_id: props.cycle_id ?? new UUID(),
    address_id: props.address_id ?? new UUID(),
    status: props.status,
    created_at: props.created_at,
    updated_at: props.updated_at,
  });

  return bag;
}
