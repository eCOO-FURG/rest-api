// Utils
import { first } from "@/core/utils/first";
import { last } from "@/core/utils/last";
import { now } from "@/core/utils/now";

// Entities
import { CycleWeek } from "@/core/entities/cycle";

export const inPeriodOf = (days: CycleWeek) => {
  return first(days) <= now() && now() >= last(days);
};
