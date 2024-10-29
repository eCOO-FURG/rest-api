// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";
import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface FetchBagUseCaseRequest {
  user_id: string;
  bag_id: string;
}

export class FetchBagUseCase {
  constructor(
    private bagsRepository: BagsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({ bag_id, user_id }: FetchBagUseCaseRequest) {
    const bag = await this.bagsRepository.search({ id: bag_id }, "merged");

    if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    const owner = bag.user.id.equals(user_id);

    if (!owner && !user.admin)
      throw new ResourceNotFoundError("Sacola", bag_id);

    return { bag };
  }
}
