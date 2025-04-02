// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { CatalogsRepository } from "@/core/repositories/catalogs-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Utils
import { first } from "@/core/utils/first";

interface FetchCurrentCatalogUseCaseRequest {
  cycle_id: string;
  farm_id: string;
  page: number;
}

export class FetchCurrentCatalogUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private farmsRepository: FarmsRepository,
    private catalogsRepository: CatalogsRepository
  ) {}

  async execute({
    cycle_id,
    farm_id,
    page,
  }: FetchCurrentCatalogUseCaseRequest) {
    const cycle = await this.cyclesRepository.find("cycle", { id: cycle_id });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const farm = await this.farmsRepository.find("farm", { id: farm_id });

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    const catalog = await this.catalogsRepository.find("catalog-and-offers", {
      cycle: { id: cycle_id },
      farm: { id: farm_id },
      offers: { page },
      since: first(cycle.offer),
    });

    if (!catalog)
      throw new ResourceNotFoundError("Catálogo no ciclo", cycle_id);

    return { catalog };
  }
}
