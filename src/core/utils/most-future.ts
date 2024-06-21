import { Week } from "@/core/entities/cycle";

export function mostFuture(days: Week) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates = days.map((day) => {
    const ahead = (day - today.getDay() + 7) % 7;

    const date = new Date(today.getTime() + (ahead + 1) * 24 * 60 * 60 * 1000);

    date.setUTCHours(0, 0, 0, 0);

    return date;
  });

  const mostDistant = dates.sort((a, b) => b.getTime() - a.getTime())[0];

  return mostDistant;
}
