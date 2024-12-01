import { ResourceNotFoundError } from "../errors/resource-not-found";
import { UsersRepository } from "../repositories/users-repository";

interface RequestHelpUseCaseRequest {
  user_id: string;
  content: string;
}

export class RequestHelpUseCase {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  async execute({ user_id, content }: RequestHelpUseCaseRequest) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    
  }
}