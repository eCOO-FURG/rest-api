// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Entities
import { Email } from "@/core/entities/email";

// Services
import { Hasher } from "@/core/cryptography/hasher";
import { Mailer } from "@/core/mail/mailer";
import { DomainEvents } from "@/core/events/domain-events";

interface RequestPasswordUpdateUseCaseRequest {
  email: string;
}

export class RequestPasswordUpdateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private mailer: Mailer,
    private hasher: Hasher
  ) {}

  async execute({ email }: RequestPasswordUpdateUseCaseRequest) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new ResourceNotFoundError("Usuário", email);
    }

    user.reset();

    const token = await this.hasher.hash({ user_id: user.id.value });

    const view = await this.mailer.load({
      view: "request-password-update",
      props: {
        token,
      },
    });

    const mail = Email.create({
      to: email,
      subject: "Atualização de senha | eCOO",
      content: view,
    });

    await this.mailer.send(mail);
    
    DomainEvents.dispatch(user);
  }
}
