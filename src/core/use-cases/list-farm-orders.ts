// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { OrdersRepository } from "@/core/repositories/orders-repository";

// Utils
import { mostPast } from "@/core/utils/most-past";

interface ListFarmOrdersUseCaseRequest {
  farm_id: string;
  cycle_id: string;
}

export class ListFarmOrdersUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private cyclesRepository: CyclesRepository,
    private offersRepository: OffersRepository,
    private ordersRepository: OrdersRepository
  ) {}

  async execute({ farm_id, cycle_id }: ListFarmOrdersUseCaseRequest) {
    const cycle = await this.cyclesRepository.findById(cycle_id);

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const farm = await this.farmsRepository.search(
      { id: farm_id },
      "aggregate"
    );

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    const offers = await this.offersRepository.searchMany(
      {
        farm_id,
        cycle_id,
        since: mostPast(cycle.offer),
      },
      "entity"
    );

    const offersIds = offers.map((offer) => offer.id.value);

    const orders = await this.ordersRepository.searchMany(
      {
        offers_ids: offersIds,
        since: mostPast(cycle.order),
      },
      "aggregate"
    );

    return {
      farm,
      orders,
    };
  }
}
