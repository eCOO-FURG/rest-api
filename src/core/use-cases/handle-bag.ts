// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";

// Entities
import { Bag } from "@/core/entities/bag";

interface HandleBagUseCaseRequest {
  bag_id: string;
  status: Bag["status"];
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
