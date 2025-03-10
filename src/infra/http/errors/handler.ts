// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { JsonWebTokenError } from "jsonwebtoken";

// Errors
import { DomainError } from "@/core/errors/domain-error";
import { HttpErrorMapper } from "@/infra/http/errors/mapper";

// Logs
import { Logger } from "@/infra/logs/logger";

export const handler = (
  error: Error,
  _: Request,
  response: Response,
  __: NextFunction
) => {
  if (error instanceof Joi.ValidationError) {
    return response.status(400).send({
      message: "Ocorreu um erro de validação",
      code: "bad-request",
      details: error.message.replace(/['"]/g, ""),
    });
  }

  if (error instanceof SyntaxError) {
    return response
      .status(400)
      .send({ message: "Sintaxe incorreta", code: "syntax-error" });
  }

  if (error instanceof MulterError) {
    return response.status(400).send({
      message: "Erro ao processar arquivo",
      code: "file-error",
      issues: [
        {
          field: error.field,
          message: error.message,
        },
      ],
    });
  }

  if (error instanceof JsonWebTokenError) {
    return response.status(401).send({
      message: "Assinatura inválida",
      code: "invalid-signature",
    });
  }

  if (error instanceof DomainError) {
    const found = HttpErrorMapper.find(error);

    if (found)
      return response
        .status(found.status)
        .send({ message: found.message, code: found.code });
  }

  Logger.log(error);

  return response
    .status(500)
    .send({ message: "💥 Ocorreu um erro interno.", code: "internal-error" });
};
