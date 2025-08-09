// Repositories
import { CatalogsRepository } from "@/core/repositories/catalogs-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { CyclesRepository } from "@/core/repositories/cycles-repository";

interface FetchCycleCatalogUseCaseRequest {
  cycle_id: string;
  farm_id: string;
  page: number;
  product?: string;
  available?: boolean;
  since?: Date;
  before?: Date;
}

export class FetchCycleCatalogUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private catalogsRepository: CatalogsRepository,
  ) {}

  async execute({
    cycle_id,
    farm_id,
    product,
    page,
    available,
    since,
    before,
  }: FetchCycleCatalogUseCaseRequest) {
    const cycle = await this.cyclesRepository.find("cycle", { id: cycle_id });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const catalog = await this.catalogsRepository.find("catalog-and-offers", {
      cycle: { id: cycle_id },
      farm: { id: farm_id },
      offers: { product: { name: product }, available, since, before, page },
    });

    if (!catalog)
      throw new ResourceNotFoundError("Catálogo no ciclo", cycle_id);

    return { catalog };
  }
}
