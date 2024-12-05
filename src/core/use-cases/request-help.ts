// Events
import { DomainEvents } from "@/core/events/domain-events";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface RequestHelpUseCaseRequest {
  user_id: string;
  content: string;
}

export class RequestHelpUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ user_id, content }: RequestHelpUseCaseRequest) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    user.help(content);

    DomainEvents.dispatch(user);
  }
}
