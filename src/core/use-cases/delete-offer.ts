// Errors
import { FarmNotActiveError } from "@/core/errors/farm-not-active";
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";

// Entities
import { Week } from "@/core/entities/cycle"

interface DeleteOfferUseCaseRequest {
  farm_id: string;
  cycle_id: string;
  offer_id: string;
}

export class DeleteOfferUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private cyclesRepository: CyclesRepository,
    private offersRepository: OffersRepository
  ) { }

  async execute({ farm_id, cycle_id, offer_id }: DeleteOfferUseCaseRequest) {
    const farm = await this.farmsRepository.find("basic", { id: farm_id });

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    if (farm.status !== "ACTIVE") throw new FarmNotActiveError();

    const offer = await this.offersRepository.find("basic", {
      id: offer_id
    })

    if (!offer) throw new ResourceNotFoundError("Oferta", offer_id);

    const cycle = await this.cyclesRepository.find("basic", { id: cycle_id });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const today = (new Date().getDay() + 1) as Week[0];

    if (!cycle.offer.includes(today))
      throw new ResourceClosedError("Oferta", offer_id);

    await this.offersRepository.delete(offer.id.value);
  }
}