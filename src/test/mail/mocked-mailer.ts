// Entities
import { Message } from "@/core/entities/message";

// Services
import { Mailer, MailerLoadRequest } from "@/core/mail/mailer";

export class MockedMailer implements Mailer {
  public messages: Message[] = [];

  async send(message: Message): Promise<void> {
    this.messages.push(message);
  }

  async enqueue(messages: Message[]): Promise<void> {
    this.messages.push(...messages);
  }

  async load({ view, props }: MailerLoadRequest): Promise<string> {
    return `${view} \n ${props}`;
  }
}
