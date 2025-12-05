// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";
import { MarketsRepository } from "@/core/repositories/markets-repository";

// Errors
import { InvalidFieldError } from "@/core/errors/invalid-field";
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Utils
import { first } from "@/core/utils/first";
import { inPeriodOf } from "@/core/utils/in-period-of";

interface UpdateOfferUseCaseRequest {
  user_id: string;
  offer_id: string;
  farm_id?: string;
  amount?: number;
  price?: number;
  description?: string;
  comment?: string;
  expires_at?: Date;
  active?: boolean;
}

export class UpdateOfferUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private offersRepository: OffersRepository,
    private cyclesRepository: CyclesRepository,
    private marketsRepository: MarketsRepository,
  ) {}

  async execute({
    user_id,
    farm_id,
    offer_id,
    amount,
    price,
    description,
    expires_at,
    active,
    comment,
  }: UpdateOfferUseCaseRequest) {
    const user = await this.usersRepository.find("user", {
      id: user_id,
    });

    if (!user) {
      throw new ResourceNotFoundError("Usuário", user_id);
    }

    const offer = await this.offersRepository.find("merchandise", {
      id: offer_id,
    });

    if (!offer) {
      throw new ResourceNotFoundError("Oferta", offer_id);
    }

    if (!user.admin && (!farm_id || !offer.farm_id.equals(farm_id))) {
      throw new ResourceNotFoundError("Oferta", offer_id);
    }

    offer.amount = amount ?? offer.amount;
    offer.price = price ?? offer.price;
    offer.description = description ?? offer.description;
    offer.expires_at = expires_at ?? offer.expires_at;
    offer.active = active ?? offer.active;
    offer.comment = comment ?? offer.comment;

    offer.touch();

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

      return await this.offersRepository.update(offer);
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

    if (expires_at && offer.product.perishable) {
      throw new InvalidFieldError("expires_at");
    }

    await this.offersRepository.update(offer);
  }
}
