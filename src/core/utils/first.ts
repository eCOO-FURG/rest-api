// Entities
import { CycleWeek } from "@/core/entities/cycle";

// Utils
import { now } from "@/core/utils/now";
import { today } from "@/core/utils/today";

export function first(days: CycleWeek, next = false) {
  let gap = days[0] - today();

  if (next) {
    gap += 7;
  }

  const first = now();

  first.setDate(first.getDate() + gap);
  first.setUTCHours(0, 0, 0, 0);

  return first;
}
