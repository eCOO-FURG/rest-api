// Libs
import express, { NextFunction, Request, Response } from "express";

// Routes
import { router } from "@/infra/http/routes";
import { ZodError } from "zod";
// import { ZodError } from "zod";

const server = express();

server.use(express.json());
server.use(router);

server.use(
  (error: unknown, _: Request, response: Response, next: NextFunction) => {
    if (error instanceof ZodError) {
      const issues = error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message.toLowerCase(),
      }));

      return response
        .status(400)
        .send({ message: "Erro de validação.", issues });
    }

    return response
      .status(500)
      .send({ message: "💥 Ocorreu um erro interno." });
  }
);

server.listen(3333, () => console.log("🚀 Servidor HTTP rodando!"));
