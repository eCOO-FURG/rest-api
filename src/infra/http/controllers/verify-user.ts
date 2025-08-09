// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { VerifyUserUsecase } from "@/core/use-cases/verify-user";

// Container
import container from "@/infra/container";

// Environment
import { env } from "@/infra/env";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const verifyUserSchema = Joi.object({
  token: Joi.string().required(),
});

export async function verifyUserController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { token } = parse(verifyUserSchema, request.query);

    const verifyUserUseCase =
      container.resolve<VerifyUserUsecase>("verifyUserUseCase");

    const ip = request.ip || request.socket.remoteAddress || "unknown";

    const { roles, refresh } = await verifyUserUseCase.execute({
      token,
      ip,
      agent: request.headers["user-agent"] ?? "not-identified",
    });

    const path = roles.includes("PRODUCER") ? "login" : "telegram";

    return response
      .status(301)
      .redirect(`${env.APP_URL}/${path}?token=${refresh}`);
  } catch (error) {
    next(error);
  }
}
