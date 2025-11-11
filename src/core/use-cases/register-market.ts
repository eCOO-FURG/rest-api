// Entities
import { Market } from "@/core/entities/market";

// Repositories
import { MarketsRepository } from "@/core/repositories/markets-repository";

// Errors
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

interface RegisterMarketUseCaseRequest {
  name: string;
  description?: string;
}

export class RegisterMarketUseCase {
  constructor(private marketsRepository: MarketsRepository) {}

  async execute({ name, description }: RegisterMarketUseCaseRequest) {
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

    return { market };
  }
}
