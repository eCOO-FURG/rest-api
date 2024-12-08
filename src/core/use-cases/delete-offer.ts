// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { CatalogsRepository } from "@/core/repositories/catalogs-repository";

interface DeleteOfferUseCaseRequest {
  farm_id: string;
  offer_id: string;
}

export class DeleteOfferUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private catalogsRepository: CatalogsRepository
  ) {}

  async execute({ farm_id, offer_id }: DeleteOfferUseCaseRequest) {
    const farm = await this.farmsRepository.find("basic", { id: farm_id });

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    const catalog = await this.catalogsRepository.find("merge", {
      farm: { id: farm_id },
      offers: { id: offer_id },
    });

    if (!catalog)
      throw new ResourceNotFoundError("Catálogo com a oferta", offer_id);

    if (!catalog.farm_id.equals(farm_id))
      throw new ResourceNotFoundError("Oferta", offer_id);

    catalog.offers.delete(offer_id);

    await this.catalogsRepository.update(catalog);
  }
}
