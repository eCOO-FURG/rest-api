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
      view: "request-password-update";
      props: {
        first_name: string;
        token: string;
      };
    }
  | {
      view: "otp-request";
      props: {
        otp: string;
      };
    };

export interface Mailer {
  send(email: Email): Promise<void>;
  load({ view, props }: MailerLoadRequest): Promise<string>;
}
