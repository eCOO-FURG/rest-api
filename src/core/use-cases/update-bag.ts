// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceClosedError } from "@/core/errors/resource-closed";

// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";
import { UsersRepository } from "@/core/repositories/users-repository";

// Entities
import { Bag } from "@/core/entities/bag";

interface UpdateBagUseCaseRequest {
  bag_id: string;
  user_id: string;
  status: Bag["status"];
}

export class UpdateBagUseCase {
  constructor(
    private bagsRepository: BagsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({ bag_id, user_id, status }: UpdateBagUseCaseRequest) {
    const bag = await this.bagsRepository.find("merge", { id: bag_id });

    if (!bag) throw new ResourceNotFoundError("Sacola", bag_id);

    const owner = bag.user_id.equals(user_id);

    if (!owner) {
      const user = await this.usersRepository.find("basic", { id: user_id });

      if (!user) throw new ResourceNotFoundError("Usuário", user_id);

      if (!user.admin) throw new ResourceNotFoundError("Sacola", bag_id);
    }

    if (bag.status === "CANCELLED")
      throw new ResourceClosedError("Sacola", bag_id);

    bag.status = status;
    bag.touch();

    await this.bagsRepository.update(bag);
  }
}
