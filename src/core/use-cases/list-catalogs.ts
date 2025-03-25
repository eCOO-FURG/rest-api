// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { CatalogsRepository } from "@/core/repositories/catalogs-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Utils
import { mostPast } from "@/core/utils/most-past";

interface SearchOfferingFarmsUseCaseRequest {
  cycle_id: string;
  page: number;
  product?: string;
}

export class ListCatalogsUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private catalogsRepository: CatalogsRepository
  ) {}

  async execute({
    cycle_id,
    page,
    product,
  }: SearchOfferingFarmsUseCaseRequest) {
    const cycle = await this.cyclesRepository.find("cycle", {
      id: cycle_id,
    });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const catalogs = await this.catalogsRepository.list(
      "catalog-and-offers",
      {
        cycle: { id: cycle_id },
        since: mostPast(cycle.offer),
        offers: { product: { name: product }, expired: false, page },
      },
      page
    );

    return { catalogs };
  }
}
