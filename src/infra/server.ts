// Libraries
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import "zod-openapi/extend";

// Routes
import { router } from "@/infra/http/routes";

// Errors
import { handler } from "@/infra/http/errors/handler";

// Env
import { env } from "@/infra/env";

// Docs
import { docs } from "@/infra/docs/swagger";

const server = express();

server.use(cors());
server.use(express.json());
server.use(router);
server.use(handler);
server.use("/docs", swaggerUi.serve, swaggerUi.setup(docs));

server.listen(env.SERVER_PORT, () => console.log("🚀 Servidor HTTP rodando!"));
