// Repositories
import { OffersRepository } from "@/core/repositories/offers-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnauthorizedError } from "@/core/errors/unauthorized";
import { ClosedActionError } from "@/core/errors/closed-action";

// Utils
import { Offer } from "@/core/entities/offer";

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
    private cyclesRepository: CyclesRepository
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

    if (!offer.farm_id.equals(farm_id)) throw new UnauthorizedError();

    const cycle = await this.cyclesRepository.findById(offer.cycle_id.value);

    if (!cycle) throw new ResourceNotFoundError("Ciclo", offer.cycle_id.value);

    const today = (new Date().getDay() + 1) as Week[0];

    if (!cycle.offer.includes(today)) {
      throw new ClosedActionError("ofertar", cycle.id.value);
    }

    offer.amount = amount ?? offer.amount;
    offer.price = price ?? offer.price;

    await this.offersRepository.update(offer);
  }
}
