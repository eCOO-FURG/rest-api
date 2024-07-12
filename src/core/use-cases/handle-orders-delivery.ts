// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { OrdersRepository } from "@/core/repositories/orders-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Utils
import { mostPast } from "@/core/utils/most-past";

interface HandleOrdersDeliveryUseCaseRequest {
  cycle_id: string;
  farm_id: string;
  status: "RECEIVED" | "CANCELLED";
}

export class HandleOrdersDeliveryUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private farmsRepository: FarmsRepository,
    private ordersRepository: OrdersRepository
  ) {}

  async execute({
    cycle_id,
    farm_id,
    status,
  }: HandleOrdersDeliveryUseCaseRequest) {
    const cycle = await this.cyclesRepository.findById(cycle_id);
    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const farm = await this.farmsRepository.findById(farm_id);
    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    const orders = await this.ordersRepository.findManyByFarmIdInCycle({
      farm_id,
      cycle_id,
      created_at: mostPast(cycle.offer),
    });

    for (const order of orders) {
      order.status = status;
    }

    await this.ordersRepository.updateMany(orders);
  }
}
