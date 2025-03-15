// Repositories
import { OffersRepository } from "@/core/repositories/offers-repository";

// Errors
import { FarmNotActiveError } from "@/core/errors/farm-not-active";
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnauthorizedError } from "@/core/errors/unauthorized";

// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";

// Utils
import { mostPast } from "@/core/utils/most-past";
import { today } from "@/core/utils/today";

interface DeleteOfferUseCaseRequest {
  farm_id: string;
  offer_id: string;
}

export class DeleteOfferUseCase {
  constructor(
    private offersRepository: OffersRepository,
    private cyclesRepository: CyclesRepository
  ) {}

  async execute({ farm_id, offer_id }: DeleteOfferUseCaseRequest) {
    const offer = await this.offersRepository.find("aggregate", {
      id: offer_id,
    });

    if (!offer) throw new ResourceNotFoundError("Oferta", offer_id);

    const owner = offer.catalog?.farm?.id.equals(farm_id);

    if (!owner) throw new UnauthorizedError();

    const active = offer.catalog?.farm?.status === "ACTIVE";

    if (!active) throw new FarmNotActiveError();

    const cycle = await this.cyclesRepository.find("basic", {
      id: offer.catalog?.cycle_id.value,
    });

    if (!cycle)
      throw new ResourceNotFoundError("Ciclo", offer.catalog!.cycle_id.value);

    if (offer.created_at < mostPast(cycle.order))
      throw new ResourceClosedError("Oferta", offer.id.value);

    const isOfferingDay = cycle.offer.includes(today());

    if (!isOfferingDay) throw new ResourceClosedError("Ciclo", cycle.id.value);

    await this.offersRepository.delete(offer);
  }
}
