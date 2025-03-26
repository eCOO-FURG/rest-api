// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

interface FetchProfileUseCaseRequest {
  user_id: string;
}

export class FetchProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ user_id }: FetchProfileUseCaseRequest) {
    const user = await this.usersRepository.find("user", { id: user_id });

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    return { user };
  }
}
