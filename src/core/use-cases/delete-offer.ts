// Errors
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";

// Utils
import { getToday } from "@/core/utils/get-today";
import { mostPast } from "@/core/utils/most-past";

interface DeleteOfferUseCaseRequest {
  farm_id: string;
  offer_id: string;
}

export class DeleteOfferUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private cyclesRepository: CyclesRepository,
    private offersRepository: OffersRepository
  ) {}

  async execute({ farm_id, offer_id }: DeleteOfferUseCaseRequest) {
    const farm = await this.farmsRepository.find("basic", { id: farm_id });

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    const offer = await this.offersRepository.find("basic", {
      id: offer_id,
      farm: { id: farm.id.value }
    })

    if (!offer) throw new ResourceNotFoundError("Oferta", offer_id);

    if (!offer.catalog) throw new ResourceNotFoundError("Catálogo da oferta", offer_id);
    
    const cycle_id = offer.catalog.cycle_id;

    const cycle = await this.cyclesRepository.find("basic", { id: cycle_id.value });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id.value);

    const today = getToday();

    const oldestOfferDate = mostPast(cycle.offer);

    if (!cycle.offer.includes(today) || offer.created_at > oldestOfferDate)
      throw new ResourceClosedError("Oferta", offer_id);

    await this.offersRepository.delete(offer);
  }
}