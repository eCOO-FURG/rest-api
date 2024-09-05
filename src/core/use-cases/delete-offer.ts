// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnauthorizedError } from "@/core/errors/unauthorized";

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
    const farm = await this.farmsRepository.search({ id: farm_id }, "entity");

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    const offer = await this.offersRepository.search(
      { id: offer_id },
      "entity"
    );

    if (!offer) throw new ResourceNotFoundError("Oferta", offer_id);

    const catalog = await this.catalogsRepository.search(
      { id: offer.catalog_id.value },
      "entity"
    );

    if (!catalog)
      throw new ResourceNotFoundError("Catálogo", offer.catalog_id.value);

    if (!catalog.farm_id.equals(farm_id)) throw new UnauthorizedError();

    await this.offersRepository.delete(offer);
  }
}
