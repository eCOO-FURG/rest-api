// Entities
import { Message } from "@/core/entities/message";

// Message
import { Chat } from "@/core/message/chat";

// Environment
import { env } from "@/infra/env";

// Libraries
import WebSocket from "ws";

// Logger
import { Logger } from "@/infra/logs/logger";

export class Telegram implements Chat {
  private ws: WebSocket | null = null;

  async send(message: Message): Promise<void> {
    try {
      this.client().send(
        JSON.stringify({
          id: message.id.value,
          to: message.to,
          subject: message.subject,
          content: message.content,
          files: message.files,
          created_at: message.created_at,
          updated_at: message.updated_at,
        }),
      );
    } catch (error) {
      Logger.log(error);
    }
  }

  private client(): WebSocket {
    if (!this.ws) {
      this.ws = new WebSocket(env.WS_URL, {
        headers: { Authorization: env.INTEGRATIONS_AUTHORIZATION },
      });

      this.ws.on("error", (error) => {
        if (!("code" in error && error.code === "ECONNREFUSED")) {
          Logger.log(error);
        }
      });

      this.ws.on("close", () => {
        this.ws = null;
      });

      return this.ws;
    } else {
      return this.ws;
    }
  }
}
