import { Week } from "@/core/entities/cycle";

export function getToday() {
  return (new Date().getDay() + 1) as Week[0];
}