// Entities
import { Box, BoxProps } from "@/core/entities/box";
import { UUID } from "@/core/entities/aggregates/uuid";

export function makeBox(props: Partial<BoxProps> = {}) {
  return Box.create({
    ...props,
    id: props.id ?? new UUID(),
    cycle_id: props.cycle_id ?? new UUID(),
    farm_id: props.farm_id ?? new UUID(),
  });
}
