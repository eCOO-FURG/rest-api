// Entities
import { CycleWeek } from "@/core/entities/cycle";

export function mostPast(days: CycleWeek) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates = days.map((day) => {
    const ago = (today.getDay() - day + 7) % 7;

    const date = new Date(today.getTime() - (ago + 1) * 24 * 60 * 60 * 1000);

    date.setUTCHours(0, 0, 0, 0);

    return date;
  });

  const mostDistant = dates.sort((a, b) => a.getTime() - b.getTime())[0];

  return mostDistant;
}
