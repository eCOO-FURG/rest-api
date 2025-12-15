// Repositories
import { MarketsRepository } from "@/core/repositories/markets-repository";

interface ListMarketsUseCaseRequest {
  page: number;
  open?: boolean;
  name?: string;
}

export class ListMarketsUseCase {
  constructor(private marketsRepository: MarketsRepository) {}

  async execute({ page, open, name }: ListMarketsUseCaseRequest) {
    const markets = await this.marketsRepository.list(
      "market-and-details",
      {
        name,
        open,
      },
      page,
    );

    return { markets };
  }
}
