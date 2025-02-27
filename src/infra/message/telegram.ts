// Entities
import { Message } from "@/core/entities/message";

// Message
import { Chat } from "@/core/message/chat";

// Env
import { env } from "@/infra/env";

// Libraries
import WebSocket from "ws";

// Logger
import { Logger } from "@/infra/logs/logger";

// Presenters
import { MessagePresenter } from "@/infra/http/presenters/message-presenter";

export class Telegram implements Chat {
  private client: WebSocket;

  constructor() {
    this.client = new WebSocket(env.WS_URL, {
      headers: { Authorization: env.INTEGRATIONS_AUTHORIZATION },
    });

    this.client.on("error", (error) => {
      Logger.log(error);
    });
  }

  async send(message: Message): Promise<void> {
    try {
      if (this.client.readyState === WebSocket.OPEN) {
        this.client.send(JSON.stringify(MessagePresenter.toHttp(message)));
      }
    } catch (error) {
      Logger.log(error);
    }
  }
}
