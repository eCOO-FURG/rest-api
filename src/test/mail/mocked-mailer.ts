// Entities
import { Email } from "@/core/entities/email";

// Services
import { Mailer, MailerLoadRequest } from "@/core/mail/mailer";

export class MockedMailer implements Mailer {
  async send(email: Email): Promise<void> {}

  async load({ view, props }: MailerLoadRequest): Promise<string> {
    return `${view} \n ${props}`;
  }
}
