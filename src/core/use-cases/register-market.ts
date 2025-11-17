// Entities
import { Job } from "@/core/entities/job";
import { Market } from "@/core/entities/market";

// Repositories
import { MarketsRepository } from "@/core/repositories/markets-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";

// Jobs
import { Scheduler } from "@/core/jobs/scheduler";

// Errors
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Utils
import { now } from "@/core/utils/now";

interface RegisterMarketUseCaseRequest {
  name: string;
  description?: string;
  cycle_id?: string;
}

export class RegisterMarketUseCase {
  constructor(
    private marketsRepository: MarketsRepository,
    private cyclesRepository: CyclesRepository,
    private scheduler: Scheduler,
  ) {}

  async execute({ name, description, cycle_id }: RegisterMarketUseCaseRequest) {
    const cycle = cycle_id
      ? await this.cyclesRepository.find("cycle", {
          id: cycle_id,
        })
      : null;

    if (cycle_id && !cycle) {
      throw new ResourceNotFoundError("Ciclo", cycle_id);
    }

    const openMarket = await this.marketsRepository.find("market", {
      open: true,
    });

    if (openMarket) {
      throw new ResourceAlreadyExistsError("Mercado", "aberto");
    }

    const market = Market.create({
      name,
      description,
    });

    await this.marketsRepository.create(market);

    if (cycle) {
      const job = Job.create({
        name: "publish-cycle-on-market",
        params: { market_id: market.id.value, cycle_id: cycle.id.value },
        run_at: now(),
      });

      await this.scheduler.schedule(job);
    }

    return { market };
  }
}
