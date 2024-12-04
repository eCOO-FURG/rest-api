// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";
import { CatalogsRepository } from "@/core/repositories/catalogs-repository";

interface DeleteOfferUseCaseRequest {
  farm_id: string;
  offer_id: string;
}

export class DeleteOfferUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private offersRepository: OffersRepository,
    private catalogsRepository: CatalogsRepository
  ) {}

  async execute({ farm_id, offer_id }: DeleteOfferUseCaseRequest) {
    const farm = await this.farmsRepository.find("basic", { id: farm_id });

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    const offer = await this.offersRepository.find("basic", { id: offer_id });

    if (!offer) throw new ResourceNotFoundError("Oferta", offer_id);

    const catalog = await this.catalogsRepository.find("basic", {
      id: offer.catalog_id.value,
    });

    if (!catalog)
      throw new ResourceNotFoundError("Catálogo", offer.catalog_id.value);

    if (!catalog.farm_id.equals(farm_id))
      throw new ResourceNotFoundError("Oferta", offer_id);

    await this.offersRepository.delete(offer);
  }
}
