// Repositories
import { CategoriesRepository } from "@/core/repositories/categories-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { MarketsRepository } from "@/core/repositories/markets-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface ListOffersUseCaseRequest {
  page: number;
  product?: string;
  cycle_id?: string;
  market_id?: string;
  category_id?: string;
  available?: boolean;
  since?: Date;
  before?: Date;
}

export class ListOffersUseCase {
  constructor(
    private offersRepository: OffersRepository,
    private cyclesRepository: CyclesRepository,
    private marketsRepository: MarketsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute({
    page,
    product,
    market_id,
    cycle_id,
    category_id,
    available,
    since,
    before,
  }: ListOffersUseCaseRequest) {
    const cycle = cycle_id ? await this.cyclesRepository.find("cycle", { id: cycle_id }) : null;

    if (cycle_id && !cycle) {
      throw new ResourceNotFoundError("Ciclo", cycle_id);
    }

    const market = market_id
      ? await this.marketsRepository.find("market", { id: market_id })
      : null;

    if (market_id && !market) {
      throw new ResourceNotFoundError("Feira", market_id);
    }

    const category = category_id
      ? await this.categoriesRepository.find("category", { id: category_id })
      : null;

    if (category_id && !category) {
      throw new ResourceNotFoundError("Categoria", category_id);
    }

    const offers = await this.offersRepository.list(
      "offer-and-details",
      {
        product: { name: product, category: { id: category_id } },
        cycle: { id: cycle_id },
        market: { id: market_id },
        available,
        since,
        before,
      },
      page,
    );

    console.log(offers);

    return { offers };
  }
}
