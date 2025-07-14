// Entities
import { Message } from "@/core/entities/message";
import { Farm } from "@/core/entities/farm";
import { Cycle } from "@/core/entities/cycle";
import { Bag } from "@/core/entities/bag";

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
    }
  | {
      view: "order-notification";
      props: {
        first_name: string;
        bag: Bag;
        cycle: Cycle;
        existed: boolean;
      };
    };

export interface Mailer {
  send(message: Message): Promise<void>;
  enqueue(messages: Message[]): Promise<void>;
  load({ view, props }: MailerLoadRequest): Promise<string>;
}
