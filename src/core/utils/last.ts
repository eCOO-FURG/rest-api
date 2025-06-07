// Entities
import { CycleWeek } from "@/core/entities/cycle";

// Utils
import { now } from "@/core/utils/now";
import { today } from "@/core/utils/today";

export function last(days: CycleWeek, skip = false) {
  const diff = days[days.length - 1] - today() + (skip ? 7 : 0);

  const last = now();

  last.setDate(last.getDate() + diff);
  last.setUTCHours(23, 59, 59, 999);

  return last;
}
