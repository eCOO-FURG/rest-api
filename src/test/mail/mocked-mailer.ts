// Entities
import { Email } from "@/core/entities/email";

// Services
import { Mailer, MailerLoadRequest } from "@/core/mail/mailer";

export class MockedMailer implements Mailer {
  public emails: Email[] = [];

  async send(emails: Email[]): Promise<void> {
    this.emails.push(...emails);
  }

  async load({ view, props }: MailerLoadRequest): Promise<string> {
    return `${view} \n ${props}`;
  }
}
