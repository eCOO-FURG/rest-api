// Errors
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";
import { OrdersRepository } from "@/core/repositories/orders-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { MarketsRepository } from "@/core/repositories/markets-repository";

// Utils
import { first } from "@/core/utils/first";
import { inPeriodOf } from "@/core/utils/in-period-of";

interface DeleteOfferUseCaseRequest {
  user_id: string;
  offer_id: string;
  farm_id?: string;
}

export class DeleteOfferUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private offersRepository: OffersRepository,
    private ordersRepository: OrdersRepository,
    private cyclesRepository: CyclesRepository,
    private marketsRepository: MarketsRepository,
  ) {}

  async execute({ user_id, farm_id, offer_id }: DeleteOfferUseCaseRequest) {
    const user = await this.usersRepository.find("user", {
      id: user_id,
    });

    if (!user) {
      throw new ResourceNotFoundError("Usuário", user_id);
    }

    const offer = await this.offersRepository.find("offer", {
      id: offer_id,
    });

    if (!offer) {
      throw new ResourceNotFoundError("Oferta", offer_id);
    }

    if (!user.admin && (!farm_id || !offer.farm_id.equals(farm_id))) {
      throw new ResourceNotFoundError("Oferta", offer_id);
    }

    const order = await this.ordersRepository.find("order", {
      offer: { id: offer.id.value },
    });

    if (order) {
      offer.active = false;
      offer.touch();
      await this.offersRepository.update(offer);
      return;
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
