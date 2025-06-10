// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";

// Errors
import { FarmNotActiveError } from "@/core/errors/farm-not-active";
import { InvalidFieldError } from "@/core/errors/invalid-field";
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Utils
import { first } from "@/core/utils/first";
import { inPeriodOf } from "@/core/utils/in-period-of";

interface UpdateOfferUseCaseRequest {
  farm_id: string;
  offer_id: string;
  amount?: number;
  price?: number;
  description?: string;
  comment?: string;
  expires_at?: Date;
  active?: boolean;
}

export class UpdateOfferUseCase {
  constructor(
    private offersRepository: OffersRepository,
    private cyclesRepository: CyclesRepository,
  ) {}

  async execute({ farm_id, offer_id, amount, price, description, expires_at, active, comment }: UpdateOfferUseCaseRequest) {
    const offer = await this.offersRepository.find("offer-and-details", {
      id: offer_id,
    });

    if (!offer) throw new ResourceNotFoundError("Oferta", offer_id);

    if (!offer.catalog.farm_id.equals(farm_id)) throw new ResourceNotFoundError("Oferta", offer_id);

    if (offer.catalog.farm.status !== "ACTIVE") throw new FarmNotActiveError();

    const cycle = await this.cyclesRepository.find("cycle", {
      id: offer.catalog.cycle_id.value,
    });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", offer.catalog.cycle_id.value);

    if (!inPeriodOf(cycle.offer) || (offer.closes_at && offer.created_at < first(cycle.offer)))
      throw new ResourceClosedError("Oferta", offer.id.value);

    if (expires_at && offer.product.perishable) throw new InvalidFieldError("expires_at");

    offer.amount = amount ?? offer.amount;
    offer.price = price ?? offer.price;
    offer.description = description ?? offer.description;
    offer.expires_at = expires_at ?? offer.expires_at;
    offer.active = active ?? offer.active;
    offer.comment = comment ?? offer.comment;

    offer.touch();

    await this.offersRepository.update(offer);
  }
}
