// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface ListUserOrdersuseCaseRequest {
  bag_id: string;
}

export class FetchBagUseCase {
  constructor(private bagsRepository: BagsRepository) {}

  async execute({ bag_id }: ListUserOrdersuseCaseRequest) {
    const bag = await this.bagsRepository.search({ id: bag_id }, "merged");

    if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

    return {
      bag,
    };
  }
}
