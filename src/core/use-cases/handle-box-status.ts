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
      { box: { id: box.id.value } },
      "entity"
    );

    for (const item of items) {
      const order = orders.find((order) => order.id.equals(item.id));

      if (!order) throw new ResourceNotFoundError("Pedido", item.id);

      if (order.status === "PENDING") box.verified++;

      order.status = item.status;
    }

    if (box.verified === orders.length) box.status = "VERIFIED";

    await Promise.all([
      this.boxesRepository.update(box),
      this.ordersRepository.updateMany(orders),
    ]);
  }
}
