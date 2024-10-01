// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Services
import { Mailer } from "@/core/mail/mailer";

// Events
import { DomainEvents } from "@/core/events/domain-events";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Entities
import { Email } from "@/core/entities/email";
import { UUID } from "@/core/entities/aggregates/uuid";

interface OnUpdatePasswordRequestEventRequest {
  user_id: UUID;
  value: string;
}

export class OnUpdatePasswordRequestEvent {
  constructor(
    private usersRepository: UsersRepository,
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

  async execute({ user_id, value }: OnUpdatePasswordRequestEventRequest) {
    const user = await this.usersRepository.findById(user_id.value);

    if (!user) throw new ResourceNotFoundError("Usuário", user_id.value);

    const view = await this.mailer.load({
      view: "request-password-update",
      props: {
        token: value,
      },
    });

    const mail = Email.create({
      to: user.email,
      subject: "Atualização de senha | eCOO",
      content: view,
    });

    await this.mailer.send(mail);
  }
}
