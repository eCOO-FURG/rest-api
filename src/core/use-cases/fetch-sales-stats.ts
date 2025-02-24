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
    const FIVE_MONTHS_AGO = new Date().setMonth(new Date().getMonth() - 4);

    const bags = await this.bagsRepository.list("basic", {
      since: new Date(FIVE_MONTHS_AGO),
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

      const current = String(new Date().getMonth() + 1).padStart(2, "0");

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

    let totalSum = 0;
    let totalCount = 0;
    const daily = {} as Record<string, number>;

    for (const bag of bags) {
      const date = new Date(bag.created_at);
      const day = String(date.getDate()).padStart(2, "0");

      if (!daily[day]) daily[day] = 0;
      daily[day] += bag.price;

      totalSum += bag.price;
      totalCount += 1;
    }

    return {
      sum: totalSum,
      count: totalCount,
      daily,
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

    let totalSum = 0;
    let totalCount = 0;
    const daily = {} as Record<string, number>;

    for (const bag of bags) {
      const date = new Date(bag.created_at);
      const day = String(date.getDate()).padStart(2, "0");

      if (!daily[day]) daily[day] = 0;
      daily[day] += bag.price;

      totalSum += bag.price;
      totalCount += 1;
    }

    return {
      sum: totalSum,
      count: totalCount,
      daily,
    };
  }
}
