// Entities
import { CycleWeek } from "@/core/entities/cycle";

// Utils
import { now } from "@/core/utils/now";
import { today } from "@/core/utils/today";

export function first(days: CycleWeek, skip = false) {
  const diff = days[0] - today() + (skip ? 7 : 0);

  const first = now();

  first.setDate(first.getDate() + diff);
  first.setUTCHours(0, 0, 0, 0);

  return first;
}
