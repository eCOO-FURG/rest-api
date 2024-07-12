// Libs
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

// Errors
import { HttpErrorMapper } from "@/infra/http/errors/mapper";

// Logs
import { Logger } from "@/infra/logs/sentry";

export const handler = (
  error: Error,
  _: Request,
  response: Response,
  __: NextFunction
) => {
  if (error instanceof ZodError) {
    const issues = error.issues.map((issue) => ({
      field: issue.path[0],
      message: issue.message,
    }));

    return response.status(400).send({ message: "Erro de validação.", issues });
  }

  if (error instanceof SyntaxError) {
    return response.status(400).send({ message: "Sintaxe incorreta." });
  }

  const found = HttpErrorMapper.find(error);

  if (found)
    return response.status(found.code).send({ message: found.message });

  Logger.log(error);

  return response.status(500).send({ message: "💥 Ocorreu um erro interno." });
};
