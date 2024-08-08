// Entities
import { Email } from "@/core/entities/email";

// Services
import { Mailer, MailerLoadRequest } from "@/core/mail/mailer";

// Libs
import { Transporter } from "nodemailer";
import { renderFile } from "ejs";

// Env
import { env } from "@/infra/env";

// Loggs
import { Logger } from "@/infra/logs/sentry";

export class Nodemailer implements Mailer {
  constructor(
    private transporter: Transporter,
    private fallback?: Transporter
  ) {}

  async send(email: Email): Promise<void> {
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
  }

  async load({ view, props }: MailerLoadRequest): Promise<string> {
    if (view == "welcome") {
      Object.assign(props, {
        url: `${env.SERVER_URL}/users/verify?token=${props.token}`,
      });
    }

    const html = renderFile(__dirname + `/views/${view}.ejs`, { props });
    return html;
  }
}
