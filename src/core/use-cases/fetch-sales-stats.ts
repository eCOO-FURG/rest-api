// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";

export class FetchSalesStatsUseCase {
  constructor(private bagsRepository: BagsRepository) {}

  async execute() {
    const today = new Date();

    const FIVE_MONTHS_AGO = new Date(
      today.getFullYear(),
      today.getMonth() - 4,
      1
    );

    const bags = await this.bagsRepository.list("merge", {
      since: FIVE_MONTHS_AGO,
    });

    let revenue = 0;
    const current = String(today.getMonth() + 1).padStart(2, "0");

    const monthly = {} as Record<string, number>;
    const daily = {} as Record<string, number>;

    for (const bag of bags) {
      const date = new Date(bag.created_at);

      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDay()).padStart(2, "0");

      if (!monthly[month]) monthly[month] = 0;

      monthly[month] += bag.price();

      if (!daily[day]) daily[day] = 0;

      daily[day] += bag.price();

      if (month === current) revenue += bag.price();
    }

    return { revenue, monthly, daily };
  }
}
