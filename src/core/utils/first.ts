// Entities
import { CycleWeek } from "@/core/entities/cycle";

// Utils
import { now } from "@/core/utils/now";

export function first(days: CycleWeek) {
  const min = Math.min(...days);
  const max = Math.max(...days);

  const merge = max === 7 && min === 1;

  const oldest = merge ? days.reverse().find((day, index) => day - 1 !== days.at(index + 1))! : min;

  const today = now();

  const current = today.getDay() + 1;

  let difference = current - oldest;

  if (difference < 0) difference += 7;

  const date = now();

  date.setDate(today.getDate() - difference);
  date.setUTCHours(0, 0, 0, 0);

  return date;
}
