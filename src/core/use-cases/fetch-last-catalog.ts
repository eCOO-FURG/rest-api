// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { CatalogsRepository } from "@/core/repositories/catalogs-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Utils
import { mostPast } from "@/core/utils/most-past";

interface FetchLastCatalogUseCaseRequest {
  cycle_id: string;
  farm_id: string;
}

export class FetchLastCatalogUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private catalogsRepository: CatalogsRepository
  ) {}

  async execute({ cycle_id, farm_id }: FetchLastCatalogUseCaseRequest) {
    const cycle = await this.cyclesRepository.findById(cycle_id);

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const catalog = await this.catalogsRepository.search(
      {
        cycle: { id: cycle_id },
        farm: { id: farm_id },
        before: mostPast(cycle.offer),
      },
      "merged"
    );

    if (!catalog) throw new ResourceNotFoundError("Catálogo no", cycle_id);

    return { catalog };
  }
}
