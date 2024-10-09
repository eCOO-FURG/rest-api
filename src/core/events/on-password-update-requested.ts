// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Services
import { Mailer } from "@/core/mail/mailer";
import { Hasher } from "@/core/cryptography/hasher";

// Events
import { DomainEvents } from "@/core/events/domain-events";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Entities
import { Email } from "@/core/entities/email";
import { UUID } from "@/core/entities/aggregates/uuid";

interface OnUpdatePasswordRequestEventRequest {
  id: UUID;
}

export class OnUpdatePasswordRequestEvent {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: Hasher,
    private mailer: Mailer
  ) {
    this.setup();
  }

  setup() {
    DomainEvents.register(
      OnUpdatePasswordRequestEvent.name,
      this.execute.bind(this)
    );
  }

  async execute({ id }: OnUpdatePasswordRequestEventRequest) {
    const user = await this.usersRepository.findById(id.value);

    if (!user) throw new ResourceNotFoundError("Usuário", id.value);

    const token = await this.hasher.hash({ user_id: user.id.value });

    const view = await this.mailer.load({
      view: "request-password-update",
      props: { token, first_name: user.first_name },
    });

    const mail = Email.create({
      to: user.email,
      subject: "Atualização de senha | eCOO",
      content: view,
    });

    await this.mailer.send(mail);
  }
}
