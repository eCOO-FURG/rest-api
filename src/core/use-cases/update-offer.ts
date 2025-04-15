// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";

// Errors
import { FarmNotActiveError } from "@/core/errors/farm-not-active";
import { InvalidFieldError } from "@/core/errors/invalid-field";
import { MissingFieldError } from "@/core/errors/missing-field";
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnauthorizedError } from "@/core/errors/unauthorized";

// Utils
import { first } from "@/core/utils/first";
import { today } from "@/core/utils/today";

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
    private cyclesRepository: CyclesRepository,
  ) {}

  async execute({ farm_id, offer_id, amount, price, description, expires_at }: UpdateOfferUseCaseRequest) {
    if (!amount && !price && !description && !expires_at) throw new MissingFieldError("amount, price, description, expires_at");

    const offer = await this.offersRepository.find("offer-and-details", {
      id: offer_id,
    });

    if (!offer) throw new ResourceNotFoundError("Oferta", offer_id);

    const owner = offer.catalog.farm_id.equals(farm_id);

    if (!owner) throw new UnauthorizedError();

    if (offer.catalog.farm.status !== "ACTIVE") throw new FarmNotActiveError();

    const cycle = await this.cyclesRepository.find("cycle", {
      id: offer.catalog.cycle_id.value,
    });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", offer.catalog!.cycle_id.value);

    if (offer.created_at < first(cycle.order)) throw new ResourceClosedError("Oferta", offer.id.value);

    if (!cycle.offer.includes(today())) throw new ResourceClosedError("Ciclo", cycle.id.value);

    if (expires_at && offer.product?.perishable) throw new InvalidFieldError("expires_at");

    offer.amount = amount ?? offer.amount;
    offer.price = price ?? offer.price;
    offer.description = description ?? offer.description;
    offer.expires_at = expires_at ?? offer.expires_at;
    offer.touch();

    await this.offersRepository.update(offer);
  }
}
