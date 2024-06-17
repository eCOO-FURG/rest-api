// Entities
import { Email } from "../entities/email";

// Services
import { Mailer } from "@/core/mail/mailer";

// Events
import { DomainEvents } from "./domain-events";

interface OnRegisteredEventRequest {
  first_name: string;
  email: string;
}

export class OnRegisteredEvent {
  constructor(private mailer: Mailer) {
    this.setup();
  }

  setup() {
    DomainEvents.register(OnRegisteredEvent.name, this.execute.bind(this));
  }

  async execute({ first_name, email }: OnRegisteredEventRequest) {
    const view = await this.mailer.load("welcome", { first_name });

    const mail = Email.create({
      to: email,
      from: "suporte@ecoo.com",
      subject: "Bem-vindo | ecOO",
      view,
    });

    await this.mailer.send(mail);
  }
}
