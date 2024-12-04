// Entities
import { Bag } from "@/core/entities/bag";
import { UUID } from "@/core/entities/aggregates/uuid";

export function makeBag(props: Partial<Bag> = {}) {
  const bag = Bag.create({
    ...props,
    user_id: props.user_id ?? new UUID(),
    cycle_id: props.cycle_id ?? new UUID(),
    address_id: props.address_id ?? new UUID(),
    code:
      props.code ?? Math.random().toString(36).substring(2, 8).toUpperCase(),
  });

  return bag;
}
