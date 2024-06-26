// Libs
import express from "express";

// Routes
import { router } from "@/infra/http/routes";
import { errorHandler } from "./http/errors/handler";

const server = express();

server.use(express.json());
server.use(router);
server.use(errorHandler);

server.listen(3333, () => console.log("🚀 Servidor HTTP rodando!"));
