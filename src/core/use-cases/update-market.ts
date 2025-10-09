// Repositories
import { MarketsRepository } from "@/core/repositories/markets-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

interface UpdateMarketUseCaseRequest {
  market_id: string;
  name?: string;
  description?: string | null;
  open?: boolean;
}

export class UpdateMarketUseCase {
  constructor(private marketsRepository: MarketsRepository) {}

  async execute({ market_id, name, description, open }: UpdateMarketUseCaseRequest) {
    const market = await this.marketsRepository.find("market", {
      id: market_id,
    });

    if (!market) {
      throw new ResourceNotFoundError("Mercado", market_id);
    }

    if (open) {
      const openMarket = await this.marketsRepository.find("market", {
        open: true,
      });

      if (openMarket) {
        throw new ResourceAlreadyExistsError("Mercado", "aberto");
      }
    }

    market.name = name ?? market.name;
    market.description = description || description === null ? description : market.description;
    market.open = open ?? market.open;

    market.touch();

    await this.marketsRepository.update(market);
  }
}
