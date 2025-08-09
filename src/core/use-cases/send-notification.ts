// Entities
import { Message } from "@/core/entities/message";

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
    private mailer: Mailer,
  ) {}

  async execute({
    role,
    title,
    message,
    files,
  }: SendNotificationUseCaseRequest) {
    const users = await this.usersRepository.list("user", { roles: [role] });

    const view = await this.mailer.load({
      view: "notification",
      props: { title, text: message, files },
    });

    const messages: Message[] = [];

    for (const user of users) {
      const message = Message.create({
        to: user.email,
        subject: title,
        content: view,
        files,
      });

      messages.push(message);
    }

    await this.mailer.enqueue(messages);
  }
}
