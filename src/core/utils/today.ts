// Entities
import { CycleWeek } from "@/core/entities/cycle";

export function today() {
  return (new Date().getDay() + 1) as CycleWeek[0];
}
