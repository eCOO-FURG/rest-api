// Entities
import { Email } from "@/core/entities/email";

// Services
import { Mailer, MailerLoadRequest } from "@/core/mail/mailer";

// Libs
import { Transporter } from "nodemailer";
import { renderFile } from "ejs";

export class Nodemailer implements Mailer {
  constructor(private transporter: Transporter) {}

  async send(email: Email): Promise<void> {
    try {
      await this.transporter.sendMail({
        to: email.to,
        subject: email.subject,
        html: email.content,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async load({ view, props }: MailerLoadRequest): Promise<string> {
    if (view == "welcome") {
      Object.assign(props, {
        url: `localhost:3333/users/verify?token=${props.token}`,
      });
    }

    const html = renderFile(__dirname + `/views/${view}.ejs`, { props });
    return html;
  }
}
