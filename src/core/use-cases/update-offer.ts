// Repositories
import { OffersRepository } from "@/core/repositories/offers-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";

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
    private offersRepository: OffersRepository
  ) {}

  async execute({
    farm_id,
    offer_id,
    amount,
    price,
  }: UpdateOfferUpdateUseCaseRequest) {
    const farm = await this.farmsRepository.findById(farm_id);

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    const offerWithCycle =
      await this.offersRepository.findByIdWithProductAndCycle(offer_id);

    if (!offerWithCycle) throw new ResourceNotFoundError("Oferta", offer_id);

    if (!offerWithCycle.farm_id.equals(farm_id)) throw new UnauthorizedError();

    const today = (new Date().getDay() + 1) as Week[0];

    if (!offerWithCycle.cycle.offer.includes(today)) {
      throw new ClosedActionError("ofertar", offerWithCycle.cycle.id.value);
    }

    const offer = Offer.create({
      ...offerWithCycle.props,
      product_id: offerWithCycle.product.id,
      cycle_id: offerWithCycle.cycle.id,
    });

    offer.amount = amount ?? offer.amount;
    offer.price = price ?? offer.price;

    await this.offersRepository.update(offer);
  }
}
