// Libraries
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { AuthenticateUseCase } from "@/core/use-cases/authenticate";

// Presenters
import { UserPresenter } from "@/infra/http/presenters/user-presenter";

// Validation
import { notEmpty } from "@/infra/http/validation/not-empty";

export const authenticateSchema = {
  body: z
    .object({
      email: z.string().email(),
      password: z.string().min(6),
      type: z.enum(["BASIC", "OTP"]).openapi({ type: "string" }),
    })
    .refine(notEmpty.validation, notEmpty.warning),
};

export async function authenticateController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { email, password, type } = authenticateSchema.body.parse(
      request.body
    );

    const authenticateUseCase = container.resolve<AuthenticateUseCase>(
      "authenticateUseCase"
    );

    const ip = request.ip || request.socket.remoteAddress || "unknown";

    const { token, user } = await authenticateUseCase.execute({
      email,
      password,
      type,
      ip,
      agent: request.headers["user-agent"] ?? "not-identified",
    });

    return response
      .status(201)
      .send({ token, user: UserPresenter.toHttp(user) });
  } catch (error) {
    next(error);
  }
}
