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
  private server: WebSocket.Server;

  constructor() {
    this.server = new WebSocket.Server({
      port: env.WS_PORT,
      path: "/messages",
    });
  }

  async send(message: Message): Promise<void> {
    try {
      this.server.clients.forEach((client) => {
        client.send(JSON.stringify(MessagePresenter.toHttp(message)));
      });
    } catch (error) {
      Logger.log(error);
    }
  }
}
