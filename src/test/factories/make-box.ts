// Entities
import { Box } from "@/core/entities/box";
import { UUID } from "@/core/entities/aggregates/uuid";

export function makeBox(props: Partial<Box> = {}) {
  return Box.create({
    ...props,
    id: props.id ?? new UUID(),
    catalog_id: props.catalog_id ?? new UUID(),
  });
}
