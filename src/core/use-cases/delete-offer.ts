// Repositories
import { OffersRepository } from "@/core/repositories/offers-repository";
import { CatalogsRepository } from "@/core/repositories/catalogs-repository";

// Errors
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";

// Utils
import { first } from "@/core/utils/first";

interface DeleteOfferUseCaseRequest {
  farm_id: string;
  offer_id: string;
}

export class DeleteOfferUseCase {
  constructor(
    private offersRepository: OffersRepository,
    private catalogsRepository: CatalogsRepository,
    private cyclesRepository: CyclesRepository
  ) {}

  async execute({ farm_id, offer_id }: DeleteOfferUseCaseRequest) {
    const offer = await this.offersRepository.find("offer", {
      id: offer_id,
    });

    if (!offer) throw new ResourceNotFoundError("Oferta", offer_id);

    const catalog = await this.catalogsRepository.find("catalog", {
      id: offer.catalog_id.value,
    });

    if (!catalog)
      throw new ResourceNotFoundError("Catálogo", offer.catalog_id.value);

    const owner = catalog.farm_id.equals(farm_id);

    if (!owner) throw new ResourceNotFoundError("Oferta", offer_id);

    const cycle = await this.cyclesRepository.find("cycle", {
      id: catalog.cycle_id.value,
    });

    if (!cycle)
      throw new ResourceNotFoundError("Ciclo", offer.catalog!.cycle_id.value);

    if (offer.created_at < first(cycle.order))
      throw new ResourceClosedError("Oferta", offer.id.value);

    await this.offersRepository.delete(offer);
  }
}
