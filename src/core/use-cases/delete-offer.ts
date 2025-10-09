// Errors
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Repositories
import { OffersRepository } from "@/core/repositories/offers-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { MarketsRepository } from "@/core/repositories/markets-repository";

// Utils
import { first } from "@/core/utils/first";
import { inPeriodOf } from "@/core/utils/in-period-of";

interface DeleteOfferUseCaseRequest {
  farm_id: string;
  offer_id: string;
}

export class DeleteOfferUseCase {
  constructor(
    private offersRepository: OffersRepository,
    private cyclesRepository: CyclesRepository,
    private marketsRepository: MarketsRepository,
  ) {}

  async execute({ farm_id, offer_id }: DeleteOfferUseCaseRequest) {
    const offer = await this.offersRepository.find("offer", {
      id: offer_id,
    });

    if (!offer || !offer.farm_id.equals(farm_id)) {
      throw new ResourceNotFoundError("Oferta", offer_id);
    }

    if (offer.market_id) {
      const market = await this.marketsRepository.find("market", {
        id: offer.market_id.value,
      });

      if (!market) {
        throw new ResourceNotFoundError("Mercado", offer.market_id.value);
      }

      if (!market.open) {
        throw new ResourceClosedError("Mercado", market.id.value);
      }

      return await this.offersRepository.delete(offer);
    }

    if (offer.cycle_id) {
      const cycle = await this.cyclesRepository.find("cycle", {
        id: offer.cycle_id.value,
      });

      if (!cycle) {
        throw new ResourceNotFoundError("Ciclo", offer.cycle_id.value);
      }

      if (!inPeriodOf("offer", cycle)) {
        throw new ResourceClosedError("Ciclo", cycle.id.value);
      }

      if (offer.closes_at && offer.created_at < first(cycle.offer)) {
        throw new ResourceClosedError("Oferta", offer.id.value);
      }
    }

    await this.offersRepository.delete(offer);
  }
}
