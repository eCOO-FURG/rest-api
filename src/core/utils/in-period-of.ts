// Utils
import { first } from "@/core/utils/first";
import { last } from "@/core/utils/last";
import { now } from "@/core/utils/now";

// Entities
import { Cycle, CycleProps } from "@/core/entities/cycle";

export const inPeriodOf = (
  key: keyof Pick<CycleProps, "offer" | "order" | "deliver">,
  cycle: Cycle,
) => {
  return first(cycle[key]) <= now() && now() <= last(cycle[key]);
};
