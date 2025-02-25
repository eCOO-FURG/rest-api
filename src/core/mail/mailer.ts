// Entities
import { Email } from "@/core/entities/email";
import { Farm } from "@/core/entities/farm";
import { Bag } from "@/core/entities/bag";
import { Cycle } from "@/core/entities/cycle";

// Types
import { File } from "@/core/types/file";

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
        files?: File[];
      };
    }
  | {
    view: "order-notification";
    props: {
      first_name: string;
      bag: Bag,
      cycle: Cycle
    };
  }

export interface Mailer {
  send(emails: Email[]): Promise<void>;
  load({ view, props }: MailerLoadRequest): Promise<string>;
}
