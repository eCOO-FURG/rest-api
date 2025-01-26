// Entities
import { Email } from "@/core/entities/email";

// Services
import { Mailer, MailerLoadRequest } from "@/core/mail/mailer";

// Libs
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

  async send(emails: Email[]): Promise<void> {
    const promises = emails.map(async (email) => {
      try {
        await this.transporter.sendMail({
          to: email.to,
          subject: email.subject,
          html: email.content,
        });
      } catch (error) {
        Logger.log(error);
        if (this.fallback) {
          try {
            await this.fallback.sendMail({
              to: email.to,
              subject: email.subject,
              html: email.content,
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

    if (view == "request-password-update") {
      Object.assign(props, {
        url: `${env.FRONT_URL}/alterar-cadastro?token=${props.token}`,
      });
    }

    const html = renderFile(__dirname + `/views/${view}.ejs`, { props });

    return html;
  }
}
