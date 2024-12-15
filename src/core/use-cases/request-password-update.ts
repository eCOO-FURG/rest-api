// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Services
import { DomainEvents } from "@/core/events/domain-events";

interface RequestPasswordUpdateUseCaseRequest {
  email: string;
}

export class RequestPasswordUpdateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email }: RequestPasswordUpdateUseCaseRequest) {
    const user = await this.usersRepository.find("basic", {
      email,
    });

    if (!user) throw new ResourceNotFoundError("Usuário", email);

    user.reset();

    DomainEvents.dispatch(user);
  }
}
