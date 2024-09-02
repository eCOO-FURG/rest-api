// Entities
import { Box } from "@/core/entities/box";
import { UUID } from "@/core/entities/aggregates/uuid";

export function makeBox(props: Partial<Box> = {}) {
  return Box.create({
    id: props.id,
    status: props.status,
    catalog_id: props.catalog_id ?? new UUID(),
    created_at: props.created_at,
    updated_at: props.updated_at,
  });
}
