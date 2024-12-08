// Repositories
import { OffersRepository } from "@/core/repositories/offers-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { CatalogsRepository } from "@/core/repositories/catalogs-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceClosedError } from "@/core/errors/resource-closed";

// Entities
import { Week } from "@/core/entities/cycle";

interface UpdateOfferUseCaseRequest {
  farm_id: string;
  offer_id: string;
  amount?: number;
  price?: number;
  description?: string;
}

export class UpdateOfferUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private cyclesRepository: CyclesRepository,
    private catalogsRepository: CatalogsRepository
  ) {}

  async execute({
    farm_id,
    offer_id,
    amount,
    price,
    description,
  }: UpdateOfferUseCaseRequest) {
    const farm = await this.farmsRepository.find("basic", { id: farm_id });

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    const catalog = await this.catalogsRepository.find("merge", {
      offers: { id: offer_id },
    });

    if (!catalog)
      throw new ResourceNotFoundError("Catálogo com oferta", offer_id);

    if (!catalog.farm_id.equals(farm_id))
      throw new ResourceNotFoundError("Oferta", offer_id);

    const cycle = await this.cyclesRepository.find("basic", {
      id: catalog.cycle_id.value,
    });

    if (!cycle)
      throw new ResourceNotFoundError("Ciclo", catalog.cycle_id.value);

    const today = (new Date().getDay() + 1) as Week[0];

    if (!cycle.offer.includes(today))
      throw new ResourceClosedError("Ciclo", cycle.id.value);

    const offer = catalog.offers.get(offer_id);

    if (!offer) throw new ResourceNotFoundError("Oferta", offer_id);

    offer.amount = amount ?? offer.amount;
    offer.price = price ? price + (price * farm.tax) / 100 : offer.price;
    offer.description = description ?? offer.description;

    catalog.offers.set(offer_id, offer);

    await this.catalogsRepository.update(catalog);
  }
}
