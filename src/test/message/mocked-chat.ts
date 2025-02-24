// Entities
import { Message } from "@/core/entities/message";

// Message
import { Chat } from "@/core/message/chat";

export class MockedChat implements Chat {
  async send(message: Message): Promise<void> {
    return;
  }
}
