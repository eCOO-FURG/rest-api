// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Use-cases
import { AuthenticateUseCase } from "@/core/use-cases/authenticate";

// Presenters
import { UserPresenter } from "@/infra/http/presenters/user-presenter";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const authenticateSchema = Joi.object({
  email: Joi.string().email().required().example("user@example.com"),
  password: Joi.string().required(),
  type: Joi.string()
    .valid("BASIC", "OTP")
    .required()
    .description("BASIC or OTP"),
});

export async function authenticateController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { email, password, type } = parse(authenticateSchema, request.body);

    const authenticateUseCase = container.resolve<AuthenticateUseCase>(
      "authenticateUseCase",
    );

    const { token, user } = await authenticateUseCase.execute({
      email,
      password,
      type,
      ip: request.ip || request.socket.remoteAddress || "unknown",
      agent: request.headers["user-agent"] ?? "not-identified",
    });

    return response
      .status(201)
      .send({ token, user: UserPresenter.toHttp(user) });
  } catch (error) {
    next(error);
  }
}
