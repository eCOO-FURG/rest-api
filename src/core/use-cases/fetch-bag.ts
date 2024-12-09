// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";
import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface FetchBagUseCaseRequest {
  user_id: string;
  bag_id: string;
  page: number;
}

export class FetchBagUseCase {
  constructor(
    private bagsRepository: BagsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({ bag_id, user_id, page }: FetchBagUseCaseRequest) {
    const bag = await this.bagsRepository.find("merge", {
      id: bag_id,
      orders: { page },
      payments: { page },
    });

    if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

    const owner = bag.user_id.equals(user_id);

    if (!owner) {
      const user = await this.usersRepository.find("basic", { id: user_id });

      if (!user) throw new ResourceNotFoundError("Usuário", user_id);

      if (!user.admin) throw new ResourceNotFoundError("Sacola", bag_id);
    }

    return { bag };
  }
}
