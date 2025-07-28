// Entities
import { CycleWeek } from "@/core/entities/cycle";

// Utils
import { now } from "@/core/utils/now";
import { today } from "@/core/utils/today";

export function first(days: CycleWeek, skip = false) {
  const gap = today() - days[0] + (skip ? 7 : 0);

  const first = now();

  first.setDate(first.getDate() - (gap < 0 ? 7 + gap : gap));
  first.setUTCHours(0, 0, 0, 0);

  return first;
}
