// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { CatalogsRepository } from "@/core/repositories/catalogs-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceClosedError } from "@/core/errors/resource-closed";

// Entities
import { Week } from "@/core/entities/cycle";

interface UpdateCatalogUseCaseRequest {
  farm_id: string;
  catalog_id: string;
  offers: {
    id: string;
    amount?: number;
    price?: number;
    description?: string;
    deleted?: boolean;
  }[];
}

export class UpdateCatalogUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private cyclesRepository: CyclesRepository,
    private catalogsRepository: CatalogsRepository
  ) {}

  async execute({ farm_id, catalog_id, offers }: UpdateCatalogUseCaseRequest) {
    const farm = await this.farmsRepository.find("basic", { id: farm_id });

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    const catalog = await this.catalogsRepository.find("merge", {
      id: catalog_id,
    });

    if (!catalog) throw new ResourceNotFoundError("Catálogo ", catalog_id);

    const owner = catalog.farm_id.equals(farm_id);

    if (!owner) throw new ResourceNotFoundError("Catálogo", catalog_id);

    const cycle = await this.cyclesRepository.find("basic", {
      id: catalog.cycle_id.value,
    });

    if (!cycle)
      throw new ResourceNotFoundError("Ciclo", catalog.cycle_id.value);

    const today = (new Date().getDay() + 1) as Week[0];

    if (!cycle.offer.includes(today))
      throw new ResourceClosedError("Ciclo", cycle.id.value);

    for (const item of offers) {
      const offer = catalog.offers.get(item.id);

      if (!offer) throw new ResourceNotFoundError("Oferta", item.id);

      if (item.deleted) {
        catalog.offers.delete(item.id);
        continue;
      }

      offer.amount = item.amount ?? offer.amount;
      offer.description = item.description ?? offer.description;

      offer.price = item.price
        ? item.price + (offer.price * farm.tax) / 100
        : offer.price;

      offer.touch();
      catalog.offers.set(offer.id.value, offer);
    }

    await this.catalogsRepository.update(catalog);
  }
}
