// Entities
import { Job } from "@/core/entities/job";

// Repositories
import { MarketsRepository } from "@/core/repositories/markets-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Jobs
import { Scheduler } from "@/core/jobs/scheduler";

// Utils
import { now } from "@/core/utils/now";

interface PublishCycleOnMarketUseCaseRequest {
  market_id: string;
  cycle_id: string;
}

export class PublishCycleOnMarketUseCase {
  constructor(
    private marketsRepository: MarketsRepository,
    private cyclesRepository: CyclesRepository,
    private scheduler: Scheduler,
  ) {}

  async execute({ market_id, cycle_id }: PublishCycleOnMarketUseCaseRequest) {
    const market = await this.marketsRepository.find("market", { id: market_id });

    if (!market) {
      throw new ResourceNotFoundError("Market", market_id);
    }

    const cycle = await this.cyclesRepository.find("cycle", { id: cycle_id });

    if (!cycle) {
      throw new ResourceNotFoundError("Cycle", cycle_id);
    }

    const job = Job.create({
      name: "publish-cycle-on-market",
      params: { market_id: market.id.value, cycle_id: cycle.id.value },
      run_at: now(),
    });

    await this.scheduler.schedule(job);
  }
}
