// Repositories
import { MarketsRepository } from "@/core/repositories/markets-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface FetchMarketUseCaseRequest {
  market_id: string;
}

export class FetchMarketUseCase {
  constructor(private marketsRepository: MarketsRepository) {}

  async execute({ market_id }: FetchMarketUseCaseRequest) {
    const market = await this.marketsRepository.find("market-and-details", {
      id: market_id,
    });

    if (!market) {
      throw new ResourceNotFoundError("Mercado", market_id);
    }

    return { market };
  }
}
