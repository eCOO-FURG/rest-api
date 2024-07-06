import { Week } from "@/core/entities/cycle";

export function mostFuture(days: Week) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates = days.map((day) => {
    const ago = (today.getDay() - day + 7) % 7;

    const date = new Date(today.getTime() - (ago + 1) * 24 * 60 * 60 * 1000);

    date.setUTCHours(23, 59, 59, 999);

    return date;
  });

  const mostDistant = dates.sort((a, b) => a.getTime() - b.getTime())[
    dates.length - 1
  ];

  return mostDistant;
}
