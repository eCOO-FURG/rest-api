// Entities
import { Message } from "@/core/entities/message";
import { Farm } from "@/core/entities/farm";

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
        text: string;
        farm: Farm;
      };
    }
  | {
      view: "notification";
      props: {
        title: string;
        text: string;
        files?: File[];
      };
    };

export interface Mailer {
  send(messages: Message[]): Promise<void>;
  load({ view, props }: MailerLoadRequest): Promise<string>;
}
