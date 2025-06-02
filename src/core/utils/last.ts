// Entities
import { CycleWeek } from "@/core/entities/cycle";

// Utils
import { now } from "@/core/utils/now";

export function last(days: CycleWeek) {
  const min = Math.min(...days);
  const max = Math.max(...days);

  const merge = max === 7 && min === 1;

  const newest = merge ? days.find((day, index) => day + 1 !== days.at(index + 1))! : max;

  const today = now();

  const current = today.getDay() + 1;

  let difference = newest - current;

  if (difference < 0) difference += 7;

  const date = now();

  date.setDate(date.getDate() + difference);
  date.setUTCHours(23, 59, 59, 999);

  return date;
}
