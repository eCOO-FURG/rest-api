// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { VerifyUserUsecase } from "@/core/use-cases/verify-user";

// Container
import container from "@/infra/container";

// Env
import { env } from "@/infra/env";

export const verifyUserSchema = {
  query: z.object({
    token: z.string(),
  }),
};

export async function verifyUserController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { token } = verifyUserSchema.query.parse(request.query);

    const verifyUserUseCase =
      container.resolve<VerifyUserUsecase>("verifyUserUseCase");

    if (!request.ip) {
      return response.status(400).send({ message: "Cliente descontado" });
    }

    const { roles, newToken } = await verifyUserUseCase.execute({
      token,
      ip: request.ip,
      agent: request.headers["user-agent"] ?? "not-identified",
    });

    const isProducer = roles.includes("PRODUCER");

    const path = isProducer ? `${env.FRONT_URL}/login?token=${newToken}` : `${env.FRONT_URL}/telegram`;

    return response.redirect(301, path);
  } catch (error) {
    next(error);
  }
}
