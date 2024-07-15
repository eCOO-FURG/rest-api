// Entities
import { Email } from "@/core/entities/email";

export type MailerLoadRequest =
  | {
      view: "welcome";
      props: {
        first_name: string;
        token: string;
      };
    }
  | {
      view: "password-update";
      props: {
        token: string;
      };
    };

export interface Mailer {
  send(email: Email): Promise<void>;
  load({ view, props }: MailerLoadRequest): Promise<string>;
}
