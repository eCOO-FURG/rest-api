// Repositories

import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Mail
import { Mailer } from "@/core/mail/mailer";

// Cryptography
import { Hasher } from "@/core/cryptography/hasher";

// Entities
import { Message } from "@/core/entities/message";

interface ResetPasswordUseCaseRequest {
  email: string;
}

export class ResetPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: Hasher,
    private mailer: Mailer,
  ) {}

  async execute({ email }: ResetPasswordUseCaseRequest) {
    const user = await this.usersRepository.find("user", { email });

    if (!user) {
      throw new ResourceNotFoundError("Usuário", email);
    }

    const token = await this.hasher.hash({ user_id: user.id.value });

    const view = await this.mailer.load({
      view: "password-update",
      props: { token, first_name: user.first_name },
    });

    const message = Message.create({
      to: user.email,
      subject: "Atualização de senha | eCOO",
      content: view,
    });

    this.mailer.send(message);
  }
}
