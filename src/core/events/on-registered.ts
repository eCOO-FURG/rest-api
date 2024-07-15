// Entities
import { UUID } from "@/core/entities/value-objects/uuid";
import { Email } from "@/core/entities/email";

// Services
import { Mailer } from "@/core/mail/mailer";

// Events
import { DomainEvents } from "@/core/events/domain-events";
import { Hasher } from "@/core/cryptography/hasher";

interface OnRegisteredEventRequest {
  id: UUID;
  first_name: string;
  email: string;
}

export class OnRegisteredEvent {
  constructor(private mailer: Mailer, private hasher: Hasher) {
    this.setup();
  }

  setup() {
    DomainEvents.register(OnRegisteredEvent.name, this.execute.bind(this));
  }

  async execute({ id, first_name, email }: OnRegisteredEventRequest) {
    const token = await this.hasher.hash({ user_id: id.value });

    const view = await this.mailer.load({
      view: "welcome",
      props: { first_name, token },
    });

    const mail = Email.create({
      to: email,
      subject: "Bem-vindo | ecOO",
      content: view,
    });

    await this.mailer.send(mail);
  }
}
