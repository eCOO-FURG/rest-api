// Entities
import { Email } from "@/core/entities/email";
import { Farm } from "@/core/entities/farm";

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
    }
  | {
    view: "request-help";
    props: {
      content: string
      farm: Farm
    };
  };

export interface Mailer {
  send(email: Email): Promise<void>;
  load({ view, props }: MailerLoadRequest): Promise<string>;
}
