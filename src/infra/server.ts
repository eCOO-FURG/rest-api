// Libs
import express from "express";

// Routes
import { router } from "@/infra/http/routes";

// Errors
import { handler } from "@/infra/http/errors/handler";

// Env
import { env } from "@/infra/env";

const server = express();

server.use(express.json());
server.use(router);
server.use(handler);

server.listen(env.SERVER_PORT, () => console.log("🚀 Servidor HTTP rodando!"));
