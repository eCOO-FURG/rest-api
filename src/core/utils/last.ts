// Entities
import { CycleWeek } from "@/core/entities/cycle";

// Utils
import { now } from "@/core/utils/now";
import { today } from "@/core/utils/today";

export function last(days: CycleWeek, next = false) {
  let gap = days[days.length - 1] - today();

  if (next) {
    gap += 7;
  }

  const last = now();

  last.setDate(last.getDate() + gap);
  last.setUTCHours(23, 59, 59, 999);

  return last;
}
