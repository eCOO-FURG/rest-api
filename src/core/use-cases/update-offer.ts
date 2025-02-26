// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { FarmNotActiveError } from "@/core/errors/farm-not-active";
import { ResourceClosedError } from "@/core/errors/resource-closed";

// Entities
import { Week } from "@/core/entities/cycle";

interface UpdateOfferUseCaseRequest {
  farm_id: string;
  cycle_id: string;
  offer_id: string;
  amount?: number;
  price?: number;
  description?: string;
  expires_at?: Date;
}

export class UpdateOfferUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private cyclesRepository: CyclesRepository,
    private offersRepository: OffersRepository
  ) {}

  async execute({
    farm_id,
    cycle_id,
    offer_id,
    amount,
    price,
    description,
    expires_at
  }: UpdateOfferUseCaseRequest) {
    const farm = await this.farmsRepository.find("basic", { id: farm_id });

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    if (farm.status !== "ACTIVE") throw new FarmNotActiveError();

    const offer = await this.offersRepository.find("basic", { id: offer_id });

    if (!offer) throw new ResourceNotFoundError("Oferta", offer_id);

    const cycle = await this.cyclesRepository.find("basic", { id: cycle_id });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const today = (new Date().getDay() + 1) as Week[0];

    if (!cycle.offer.includes(today))
      throw new ResourceClosedError("Oferta", offer_id);

    offer.amount = amount ?? offer.amount
    offer.price = price ?? offer.price
    offer.description = description ?? offer.description
    offer.expires_at = expires_at ?? offer.expires_at

    offer.touch();

    await this.offersRepository.update(offer);
  }
}