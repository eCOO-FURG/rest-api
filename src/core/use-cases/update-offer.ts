// Repositories
import { OffersRepository } from "@/core/repositories/offers-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { InvalidFieldError } from "@/core/errors/invalid-field";

// Utils
import { mostPast } from "@/core/utils/most-past";

interface UpdateOfferUseCaseRequest {
  farm_id: string;
  offer_id: string;
  amount?: number;
  price?: number;
  description?: string;
  expires_at?: Date;
}

export class UpdateOfferUseCase {
  constructor(
    private offersRepository: OffersRepository,
    private cyclesRepository: CyclesRepository
  ) {}

  async execute({
    farm_id,
    offer_id,
    amount,
    price,
    description,
    expires_at,
  }: UpdateOfferUseCaseRequest) {
    const offer = await this.offersRepository.find("aggregate", {
      id: offer_id,
    });

    if (!offer) throw new ResourceNotFoundError("Oferta", offer_id);

    const owner = offer.catalog?.farm?.id.equals(farm_id);

    if (!owner) throw new ResourceNotFoundError("Oferta", offer_id);

    const cycle = await this.cyclesRepository.find("basic", {
      id: offer.catalog?.cycle_id.value,
    });

    if (!cycle)
      throw new ResourceNotFoundError("Ciclo", offer.catalog!.cycle_id.value);

    if (offer.created_at < mostPast(cycle.order))
      throw new ResourceClosedError("Oferta", offer.id.value);

    if (expires_at && !offer.product?.perishable)
      throw new InvalidFieldError("expires_at");

    offer.amount = amount ?? offer.amount;
    offer.price = price ?? offer.price;
    offer.description = description ?? offer.description;
    offer.expires_at = expires_at ?? offer.expires_at;

    await this.offersRepository.update(offer);
  }
}
