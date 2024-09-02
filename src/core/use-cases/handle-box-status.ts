// Repositories
import { OrdersRepository } from "@/core/repositories/orders-repository";
import { BoxesRepository } from "@/core/repositories/boxes-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface HandleBoxStatusUseCaseRequest {
  box_id: string;
  status: "RECEIVED" | "CANCELLED";
}

export class HandleBoxStatusUseCase {
  constructor(
    private boxesRepository: BoxesRepository,
    private ordersRepository: OrdersRepository
  ) {}

  async execute({ box_id, status }: HandleBoxStatusUseCaseRequest) {
    const box = await this.boxesRepository.search({ id: box_id }, "entity");

    if (!box) throw new ResourceNotFoundError("Caixa", box_id);

    box.status = "VERIFIED";

    const orders = await this.ordersRepository.searchMany(
      { box: { id: box_id } },
      "entity"
    );

    for (const order of orders) {
      order.status = status;
    }

    await Promise.all([
      this.boxesRepository.update(box),
      this.ordersRepository.updateMany(orders),
    ]);
  }
}
