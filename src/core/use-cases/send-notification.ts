// Entities
import { Email } from "@/core/entities/email";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Services
import { Mailer } from "@/core/mail/mailer";

// Types
import { File } from "@/core/types/file";

interface SendNotificationUseCaseRequest {
  role: "USER" | "PRODUCER";
  title: string;
  message: string;
  files?: File[];
}

export class SendNotificationUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private mailer: Mailer
  ) {}

  async execute({
    role,
    title,
    message,
    files,
  }: SendNotificationUseCaseRequest) {
    const users = await this.usersRepository.list("basic", { role });

    const view = await this.mailer.load({
      view: "notification",
      props: { title, message, files },
    });

    const emails: Email[] = [];

    for (const user of users) {
      const mail = Email.create({
        to: user.email,
        subject: title,
        content: view,
        files,
      });

      emails.push(mail);
    }

    await this.mailer.send(emails);
  }
}
