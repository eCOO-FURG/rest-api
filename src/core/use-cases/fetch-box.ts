// Repositories
import { BoxesRepository } from "@/core/repositories/boxes-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UsersRepository } from "@/core/repositories/users-repository";

interface FetchBoxUseCaseRequest {
  user_id: string;
  box_id: string;
  page: number;
}

export class FetchBoxUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private boxesRepository: BoxesRepository,
  ) {}

  async execute({ box_id, user_id, page }: FetchBoxUseCaseRequest) {
    const box = await this.boxesRepository.find("box-and-orders", {
      id: box_id,
      orders: { page },
    });

    if (!box) throw new ResourceNotFoundError("Caixa", box_id);

    const owner = box.catalog.farm.admin_id.equals(user_id);

    if (!owner) {
      const user = await this.usersRepository.find("user", { id: user_id });

      if (!user) throw new ResourceNotFoundError("Usuário", user_id);

      if (!user.admin) throw new ResourceNotFoundError("Caixa", box_id);
    }

    return { box };
  }
}
