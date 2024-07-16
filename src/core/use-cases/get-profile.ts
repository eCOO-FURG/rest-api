// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

interface GetProfileUseCaseRequest {
  user_id: string;
}

export class GetProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ user_id }: GetProfileUseCaseRequest) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new ResourceNotFoundError("Usuário", user_id);
    }

    return {
      user,
    };
  }
}
