// Libs
import express from "express";

// Routes
import { router } from "@/infra/http/routes";

const server = express();

server.use(express.json());
server.use(router);

server.listen(3333, () => console.log("🚀 HTTP server running"));
