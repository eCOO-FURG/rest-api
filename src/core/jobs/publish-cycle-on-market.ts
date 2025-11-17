// Repositories
import { OffersRepository } from "@/core/repositories/offers-repository";

interface PublishCycleOnMarketJobRequest {
  market_id: string;
  cycle_id: string;
}

export class PublishCycleOnMarketJob {
  constructor(private offersRepository: OffersRepository) {}

  async execute({ market_id, cycle_id }: PublishCycleOnMarketJobRequest) {
    await this.offersRepository.publishCycleOnMarket(cycle_id, market_id);
  }
}
