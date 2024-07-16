// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

interface GetProfileUseCaseRequest {
  id: string;
}

export class GetProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id }: GetProfileUseCaseRequest) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new ResourceNotFoundError("Usuário", id);
    }

    return {
      user,
    };
  }
}
