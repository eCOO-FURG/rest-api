// Entities
import { CycleWeek } from "@/core/entities/cycle";

// Utils
import { now } from "@/core/utils/now";

export function today() {
  return (now().getDay() + 1) as CycleWeek[0];
}
