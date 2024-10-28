// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";
import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface FetchBagUseCaseRequest {
  bag_id: string;
  user_id?: string;
}

export class FetchBagUseCase {
  constructor(private bagsRepository: BagsRepository) {}

  async execute({ bag_id, user_id }: FetchBagUseCaseRequest) {
    const bag = await this.bagsRepository.search({ id: bag_id }, "merged");

    if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

    if (user_id && !bag.user.id.equals(user_id))
      throw new ResourceNotFoundError("Sacola", bag_id);

    return { bag };
  }
}
