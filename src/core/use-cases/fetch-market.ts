// Repositories
import { MarketsRepository } from "@/core/repositories/markets-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface FetchMarketUseCaseRequest {
  market_id: string;
  page: number;
}

export class FetchMarketUseCase {
  constructor(private marketsRepository: MarketsRepository) {}

  async execute({ market_id, page }: FetchMarketUseCaseRequest) {
    const market = await this.marketsRepository.find("market-and-offers", {
      id: market_id,
      offers: { page },
    });

    if (!market) {
      throw new ResourceNotFoundError("Mercado", market_id);
    }

    return { market };
  }
}
