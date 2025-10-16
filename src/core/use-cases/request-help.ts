// Entities
import { Message } from "@/core/entities/message";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Mail
import { Mailer } from "@/core/mail/mailer";

// Environment
import { env } from "@/infra/env";

// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";

interface RequestHelpUseCaseRequest {
  user_id: string;
  content: string;
}

export class RequestHelpUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private farmsRepository: FarmsRepository,
    private mailer: Mailer,
  ) {}

  async execute({ user_id, content }: RequestHelpUseCaseRequest) {
    const user = await this.usersRepository.find("user", {
      id: user_id,
    });

    if (!user) {
      throw new ResourceNotFoundError("Usuário", user_id);
    }

    const farm = await this.farmsRepository.find("farm-and-admin", {
      admin: { id: user_id },
    });

    if (!farm) {
      throw new ResourceNotFoundError("Fazenda do usuário", user_id);
    }

    const view = await this.mailer.load({
      view: "help",
      props: { text: content, farm },
    });

    const message = Message.create({
      to: env.EMAIL_ACCOUNT,
      subject: "Solicitação de ajuda | eCOO",
      content: view,
    });

    this.mailer.send(message);
  }
}
