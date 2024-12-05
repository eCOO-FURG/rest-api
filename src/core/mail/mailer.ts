// Entities
import { Email } from "@/core/entities/email";
import { FarmAggregate } from "@/core/entities/aggregates/farm-aggregate";

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
      farm: FarmAggregate
    };
  };

export interface Mailer {
  send(email: Email): Promise<void>;
  load({ view, props }: MailerLoadRequest): Promise<string>;
}
