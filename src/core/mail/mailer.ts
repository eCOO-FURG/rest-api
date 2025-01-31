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
      view: "password-update";
      props: {
        first_name: string;
        token: string;
      };
    }
  | {
      view: "otp";
      props: {
        otp: string;
      };
    }
  | {
      view: "help";
      props: {
        message: string;
        farm: Farm;
      };
    }
  | {
      view: "notification";
      props: {
        title: string;
        message: string;
        attachments?: { filename?: string, content: Buffer }[]
      };
    };

export interface Mailer {
  send(emails: Email[]): Promise<void>;
  load({ view, props }: MailerLoadRequest): Promise<string>;
}
