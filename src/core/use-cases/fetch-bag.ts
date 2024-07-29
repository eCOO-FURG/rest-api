// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { OrdersRepository } from "../repositories/orders-repository";

interface ListUserOrdersuseCaseRequest {
  bag_id: string;
}

export class FetchBagUseCase {
  constructor(
    private bagsRepository: BagsRepository,
    private ordersRepository: OrdersRepository
  ) {}

  async execute({ bag_id }: ListUserOrdersuseCaseRequest) {
    const bag = await this.bagsRepository.findById(bag_id);

    if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

    const orders = await this.ordersRepository.findManyByBagId(
      bag_id,
      "aggregate"
    );

    return {
      bag,
      orders,
    };
  }
}
