// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";

interface FetchSalesStatsUseCaseRequest {
  since?: Date;
  before?: Date;
  method?: "CREDIT" | "DEBIT" | "CASH" | "PIX";
}
export class FetchSalesStatsUseCase {
  constructor(private bagsRepository: BagsRepository) {}

  async execute({ since, before, method }: FetchSalesStatsUseCaseRequest) {
    const today = new Date();

    const FIVE_MONTHS_AGO = new Date(
      today.getFullYear(),
      today.getMonth() - 4,
      1
    );

    const bags = await this.bagsRepository.list("basic", {
      since: FIVE_MONTHS_AGO,
    });

    let revenue = 0;

    const monthly = {} as Record<string, number>;
    const daily = {} as Record<string, number>;

    for (const bag of bags) {
      const date = new Date(bag.created_at);

      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDay() + 1).padStart(2, "0");

      if (!monthly[month]) monthly[month] = 0;

      monthly[month] += bag.price;

      if (!daily[day]) daily[day] = 0;

      daily[day] += bag.price;

      const current = String(today.getMonth() + 1).padStart(2, "0");

      if (month === current) revenue += bag.price;
    }

    const openPayments = await this.openPaymentsTotal({ since, before });
    const revenueByMethod = await this.revenueByMethod({
      since,
      before,
      method,
    });

    return {
      revenue,
      monthly,
      daily,
      openPayments,
      revenueByMethod,
    };
  }

  private async openPaymentsTotal({
    since,
    before,
  }: FetchSalesStatsUseCaseRequest) {
    const bags = await this.bagsRepository.list("merge", {
      since,
      before,
      payments: { status: "PENDING" },
    });

    const dailyStats = {} as Record<string, { sum: number; count: number }>;
    let totalSum = 0;
    let totalCount = 0;

    bags.forEach((bag) => {
      const date = new Date(bag.created_at);
      const dateKey = date.toISOString().split("T")[0];

      if (!dailyStats[dateKey]) {
        dailyStats[dateKey] = { sum: 0, count: 0 };
      }

      dailyStats[dateKey].sum += bag.price;
      dailyStats[dateKey].count += 1;
      totalSum += bag.price;
      totalCount += 1;
    });

    return {
      sum: totalSum,
      count: totalCount,
      daily: Object.entries(dailyStats)
        .map(([date, stats]) => ({
          date: new Date(date),
          ...stats,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
    };
  }

  private async revenueByMethod({
    since,
    before,
    method,
  }: FetchSalesStatsUseCaseRequest) {
    const bags = await this.bagsRepository.list("merge", {
      since,
      before,
      payments: { method, status: "DONE" },
    });

    const dailyStats = {} as Record<string, { sum: number; count: number }>;
    let totalSum = 0;
    let totalCount = 0;

    bags.forEach((bag) => {
      const date = new Date(bag.created_at);
      const dateKey = date.toISOString().split("T")[0];

      if (!dailyStats[dateKey]) {
        dailyStats[dateKey] = { sum: 0, count: 0 };
      }

      dailyStats[dateKey].sum += bag.price;
      dailyStats[dateKey].count += 1;
      totalSum += bag.price;
      totalCount += 1;
    });

    return {
      sum: totalSum,
      count: totalCount,
      daily: Object.entries(dailyStats)
        .map(([date, stats]) => ({
          date: new Date(date),
          ...stats,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
    };
  }
}
