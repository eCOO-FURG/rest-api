// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { CatalogsRepository } from "@/core/repositories/catalogs-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Utils
import { mostPast } from "@/core/utils/most-past";

interface FetchLastCatalogUseCaseRequest {
  cycle_id: string;
  farm_id: string;
  page: number;
}

export class FetchLastCatalogUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private farmsRepository: FarmsRepository,
    private catalogsRepository: CatalogsRepository
  ) {}

  async execute({ cycle_id, farm_id, page }: FetchLastCatalogUseCaseRequest) {
    const cycle = await this.cyclesRepository.findById(cycle_id);
    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const farm = await this.farmsRepository.search({ id: farm_id }, "entity");
    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    const catalog = await this.catalogsRepository.search(
      {
        cycle: { id: cycle_id },
        farm: { id: farm_id },
        before: mostPast(cycle.offer),
        offer: {
          page,
        },
      },
      "merged"
    );

    if (!catalog)
      throw new ResourceNotFoundError("Catálogo no ciclo", cycle_id);

    return { catalog };
  }
}
