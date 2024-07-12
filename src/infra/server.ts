// Libs
import express from "express";

// Routes
import { router } from "@/infra/http/routes";

// Errors
import { handler } from "@/infra/http/errors/handler";

// Env
import { env } from "@/infra/env";
import { Logger } from "./logs/sentry";

const server = express();

server.use(express.json());
server.use(router);
server.use(handler);

server.get("/log", (_, res) => {
  Logger.log(new Error());
  res.send("Test route called");
});

server.listen(env.SERVER_PORT, () => console.log("🚀 Servidor HTTP rodando!"));
