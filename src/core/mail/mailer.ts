// Entities
import { Email } from "@/core/entities/email";

export type Views = "welcome" | "password-update";

export interface Mailer {
  send(email: Email): Promise<void>;
  load(view: Views, props: unknown): Promise<string>;
}
