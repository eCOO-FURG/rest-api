// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { mostPast } from "@/core/utils/most-past";
import { OrdersRepository } from "@/core/repositories/orders-repository";

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
  ) { }

  async execute({ farm_id, cycle_id }: ListFarmOrdersUseCaseRequest) {
    const farm = await this.farmsRepository.findById(farm_id);

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    const cycle = await this.cyclesRepository.findById(cycle_id);

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const offers = await this.offersRepository.searchMany({
      farm_id,
      cycle_id,
      created_at: mostPast(cycle.offer),
    });

    const offersIds = offers.map((offer) => offer.id.value);

    const orders = await this.ordersRepository.findManyWithOfferByOffersIds(
      offersIds
    );

    return {
      farm,
      orders,
    };
  }
}
