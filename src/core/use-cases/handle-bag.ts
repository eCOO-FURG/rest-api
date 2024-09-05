// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";

interface HandleBagUseCaseRequest {
  bag_id: string;
  status: "PENDING" | "SEPARATED" | "DISPATCHED";
}

export class HandleBagUseCase {
  constructor(private bagsRepository: BagsRepository) {}

  async execute({ bag_id, status }: HandleBagUseCaseRequest) {
    const bag = await this.bagsRepository.search({ id: bag_id }, "entity");

    if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

    bag.status = status;

    await this.bagsRepository.update(bag);
  }
}
