// Entities
import { Message } from "@/core/entities/message";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Services
import { Mailer } from "@/core/mail/mailer";

// Events
import { DomainEvents } from "@/core/events/domain-events";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Entities
import { UUID } from "@/core/entities/aggregates/uuid";

interface OnOtpRequestEventRequest {
  user_id: UUID;
  value: string;
}

export class OnOtpRequestEvent {
  constructor(
    private usersRepository: UsersRepository,
    private mailer: Mailer
  ) {
    this.setup();
  }

  setup() {
    DomainEvents.register(OnOtpRequestEvent.name, this.execute.bind(this));
  }

  async execute({ user_id, value }: OnOtpRequestEventRequest) {
    const user = await this.usersRepository.find("basic", {
      id: user_id.value,
    });

    if (!user) throw new ResourceNotFoundError("Usuário", user_id.value);

    const view = await this.mailer.load({
      view: "otp",
      props: {
        otp: value,
      },
    });

    const message = Message.create({
      to: user.email,
      subject: "Senha para acesso | eCOO",
      content: view,
    });

    await this.mailer.send([message]);
  }
}
