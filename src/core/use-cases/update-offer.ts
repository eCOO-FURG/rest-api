// Repositories
import { OffersRepository } from "@/core/repositories/offers-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnauthorizedError } from "@/core/errors/unauthorized";

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

    const offer = await this.offersRepository.findById(offer_id);

    if (!offer) throw new ResourceNotFoundError("Oferta", offer_id);

    if (!offer.farm_id.equals(farm_id)) throw new UnauthorizedError();

    offer.amount = amount ?? offer.amount;
    offer.price = price ?? offer.price;

    await this.offersRepository.update(offer);
  }
}
