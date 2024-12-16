// Repositories
import { BoxesRepository } from "@/core/repositories/boxes-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface UpdateBoxUseCaseRequest {
  box_id: string;
  orders: { id: string; status: "RECEIVED" | "CANCELLED" }[];
}

export class UpdateBoxUseCase {
  constructor(private boxesRepository: BoxesRepository) {}

  async execute({ box_id, orders }: UpdateBoxUseCaseRequest) {
    const box = await this.boxesRepository.find("merge", { id: box_id });

    if (!box) throw new ResourceNotFoundError("Caixa", box_id);

    for (const item of orders) {
      const order = box.orders.get(item.id);

      if (!order) throw new ResourceNotFoundError("Pedido", item.id);

      if (order.status === "PENDING") box.verified++;

      order.status = item.status;
      order.touch();
    }

    if (box.verified === box.orders.size) box.status = "VERIFIED";

    console.log(box);

    await this.boxesRepository.update(box);
  }
}
