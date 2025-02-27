// Entities
import { Message, MessageProps } from "@/core/entities/message";

// Types
import { View } from "@/infra/types/view";

export class MessagePresenter {
  static toWS(message: Message): View<MessageProps> {
    return {
      id: message.id.value,
      to: message.to,
      subject: message.subject,
      content: message.content,
      files: message.files,
      created_at: message.created_at,
      updated_at: message.updated_at,
    };
  }
}
