// Repositories
import { OrdersRepository } from "@/core/repositories/orders-repository";
import { BoxesRepository } from "@/core/repositories/boxes-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface HandleBoxStatusUseCaseRequest {
  box_id: string;
  items: { id: string; status: "RECEIVED" | "CANCELLED" }[];
}

export class HandleBoxStatusUseCase {
  constructor(
    private boxesRepository: BoxesRepository,
    private ordersRepository: OrdersRepository
  ) {}

  async execute({ box_id, items }: HandleBoxStatusUseCaseRequest) {
    const box = await this.boxesRepository.search({ id: box_id }, "entity");

    if (!box) throw new ResourceNotFoundError("Caixa", box_id);

    const orders = await this.ordersRepository.searchMany(
      { box: { id: box_id } },
      "entity"
    );

    for (const order of orders) {
      const item = items.find((item) => item.id === order.id.value);

      if (!item) throw new ResourceNotFoundError("Pedido", order.id.value);

      if (order.status === "PENDING") box.verified++;

      order.status = item.status;
    }

    await Promise.all([
      this.boxesRepository.update(box),
      this.ordersRepository.updateMany(orders),
    ]);
  }
}
