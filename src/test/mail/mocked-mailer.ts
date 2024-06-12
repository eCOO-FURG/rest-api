// Entities
import { Email } from "@/core/entities/email";

// Services
import { Mailer, Views } from "@/core/mail/mailer";

export class MockedMailer implements Mailer {
  async send(email: Email): Promise<void> {}

  async load(view: Views, props: unknown): Promise<string> {
    return `${view} \n ${props}`;
  }
}
