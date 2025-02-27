// Entities
import { Message } from "@/core/entities/message";

export interface Chat {
  send(message: Message): Promise<void>;
}
