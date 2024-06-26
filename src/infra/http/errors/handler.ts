// Libs
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpErrorMapper } from "./mapper";

export const errorHandler = (
  error: Error,
  _: Request,
  response: Response,
  __: NextFunction
) => {
  if (error instanceof ZodError) {
    const issues = error.issues.map((issue) => ({
      field: issue.path[0],
      message: issue.message.toLowerCase(),
    }));

    return response.status(400).send({ message: "Erro de validação.", issues });
  }

  const mapped = HttpErrorMapper.get(error);

  if (mapped)
    return response.status(mapped.code).send({ message: mapped.message });

  return response.status(500).send({ message: "💥 Ocorreu um erro interno." });
};
