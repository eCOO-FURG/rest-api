// Entities
import { Message } from "@/core/entities/message";

// Services
import { Mailer, MailerLoadRequest } from "@/core/mail/mailer";

// Libraries
import { renderFile } from "ejs";
import { Transporter } from "nodemailer";

// Env
import { env } from "@/infra/env";

// Loggs
import { Logger } from "@/infra/logs/sentry";

export class Nodemailer implements Mailer {
  constructor(
    private transporter: Transporter,
    private fallback?: Transporter
  ) {}

  async send(messages: Message[]): Promise<void> {
    const promises = messages.map(async (message) => {
      const files = message.files.map((file) => ({
        filename: file.name,
        content: file.content,
        contentType: file.mimetype,
      }));

      try {
        await this.transporter.sendMail({
          to: message.to,
          subject: message.subject,
          html: message.content,
          attachments: files,
        });
      } catch (error) {
        Logger.log(error);
        if (this.fallback) {
          try {
            await this.fallback.sendMail({
              to: message.to,
              subject: message.subject,
              html: message.content,
              attachments: files,
            });
          } catch (error) {
            Logger.log(error);
          }
        }
      }
    });

    await Promise.all(promises);
  }

  async load({ view, props }: MailerLoadRequest): Promise<string> {
    if (view == "welcome") {
      Object.assign(props, {
        url: `${env.SERVER_URL}/verify?token=${props.token}`,
      });
    }

    if (view == "password-update") {
      Object.assign(props, {
        url: `${env.FRONT_URL}/alterar-cadastro?token=${props.token}`,
      });
    }

    const html = renderFile(__dirname + `/views/${view}.ejs`, { props });

    return html;
  }
}
