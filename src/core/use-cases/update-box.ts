// Repositories
import { BoxesRepository } from "@/core/repositories/boxes-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface UpdateBoxUseCaseRequest {
  box_id: string;
  items: { id: string; status: "RECEIVED" | "CANCELLED" }[];
}

export class UpdateBoxUseCase {
  constructor(private boxesRepository: BoxesRepository) {}

  async execute({ box_id, items }: UpdateBoxUseCaseRequest) {
    const box = await this.boxesRepository.find("merge", { id: box_id });

    if (!box) throw new ResourceNotFoundError("Caixa", box_id);

    for (const item of items) {
      const order = box.orders.find((order) => order.id.equals(item.id));

      if (!order) throw new ResourceNotFoundError("Pedido", item.id);

      if (order.status === "PENDING") box.verified++;

      order.status = item.status;
    }

    if (box.verified === box.orders.length) box.status = "VERIFIED";

    await this.boxesRepository.update(box);
  }
}
