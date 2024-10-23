// Libs
import { NextFunction, Request, Response } from "express";

// Env
import { env } from "@/infra/env";

export async function ensureIntegration(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authorization = request.headers.authorization;

  if (!authorization || authorization !== env.INTEGRATIONS_AUTHORIZATION) {
    return response
      .status(401)
      .send({ message: "Não autorizado.", code: "unauthorized" });
  }

  next();
}
