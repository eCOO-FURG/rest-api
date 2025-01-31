// Entities
import { Email } from "@/core/entities/email";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Services
import { Mailer } from "@/core/mail/mailer";

// Utils
import { formatFileName } from "@/core/utils/format-file-name";
import { getFileInfoFromBuffer } from "@/core/utils/file-info";

interface SendNotificationUseCaseRequest {
  role: "USER" | "PRODUCER";
  title: string;
  message: string;
  attachments?: { filename?: string, content: Buffer }[];
}

export class SendNotificationUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private mailer: Mailer
  ) {}

  async execute({ role, title, message, attachments }: SendNotificationUseCaseRequest) {
    const users = await this.usersRepository.list("basic", { role });

    const view = await this.mailer.load({
      view: "notification",
      props: { title, message, attachments },
    });

    const emails: Email[] = [];

    for (const user of users) {
      const formattedAttachments = attachments?.map((attachment) => ({
        ...attachment,
        filename: formatFileName(attachment.filename, attachment.content),
        contentType: getFileInfoFromBuffer(attachment.content).mime
      })) || [];

      const mail = Email.create({
        to: user.email,
        subject: title,
        content: view,
        attachments: formattedAttachments,
      });

      emails.push(mail);
    }

    await this.mailer.send(emails);
  }
}
