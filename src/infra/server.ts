// Env
import "dotenv/config";
import { env } from "@/infra/env";

// Libraries
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

// Routes
import { router } from "@/infra/http/routes";

// Errors
import { handler } from "@/infra/http/errors/handler";

// Docs
import { docs } from "@/infra/docs";

const server = express();

server.use(cors());
server.use(express.json());
server.use(router);
server.use(handler);
server.use("/docs", swaggerUi.serve, swaggerUi.setup(docs));

server.listen(env.SERVER_PORT, () => console.log("🚀 Servidor HTTP rodando!"));
