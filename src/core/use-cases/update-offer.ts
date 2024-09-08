// Repositories
import { OffersRepository } from "@/core/repositories/offers-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { CatalogsRepository } from "@/core/repositories/catalogs-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnauthorizedError } from "@/core/errors/unauthorized";
import { ClosedActionError } from "@/core/errors/closed-action";

// Entities
import { Week } from "@/core/entities/cycle";

interface UpdateOfferUpdateUseCaseRequest {
  farm_id: string;
  offer_id: string;
  amount?: number;
  price?: number;
}

export class UpdateOfferUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private offersRepository: OffersRepository,
    private cyclesRepository: CyclesRepository,
    private catalogsRepository: CatalogsRepository
  ) {}

  async execute({
    farm_id,
    offer_id,
    amount,
    price,
  }: UpdateOfferUpdateUseCaseRequest) {
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

    const cycle = await this.cyclesRepository.findById(catalog.cycle_id.value);

    if (!cycle)
      throw new ResourceNotFoundError("Ciclo", catalog.cycle_id.value);

    const today = (new Date().getDay() + 1) as Week[0];

    if (!cycle.offer.includes(today))
      throw new ClosedActionError("ofertar", cycle.id.value);

    offer.amount = amount ?? offer.amount;
    
    const newPrice = price ? (price + (price * farm.tax) / 100) : offer.price;
    offer.price = newPrice;

    await this.offersRepository.update(offer);
  }
}
