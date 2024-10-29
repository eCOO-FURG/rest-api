// Repositories
import { BagsRepository } from "@/core/repositories/bags-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UsersRepository } from "@/core/repositories/users-repository";

interface ListBagsUseCaseRequest {
  user_id: string;
  page: number;
  since?: Date;
  before?: Date;
}

export class ListBagsUseCase {
  constructor(
    private bagsRepository: BagsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({ user_id, since, before, page }: ListBagsUseCaseRequest) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    const bags = await this.bagsRepository.searchMany(
      {
        user: { id: user_id },
        since,
        before,
        page,
      },
      "aggregate"
    );

    return { bags };
  }
}
