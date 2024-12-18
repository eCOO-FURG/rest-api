// Events
import { DomainEvents } from "@/core/events/domain-events";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface RequestHelpUseCaseRequest {
  user_id: string;
  message: string;
}

export class RequestHelpUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ user_id, message }: RequestHelpUseCaseRequest) {
    const user = await this.usersRepository.find("basic", { id: user_id });

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    user.help(message);

    DomainEvents.dispatch(user);
  }
}
