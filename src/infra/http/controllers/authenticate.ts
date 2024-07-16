// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { AuthenticateUseCase } from "@/core/use-cases/authenticate";

// Presenters
import { UserPresenter } from "@/infra/http/presenters/user-presenter";

const authenticateSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    type: z.enum(["OTP", "BASIC"]),
  }),
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

    if (!request.ip) {
      return response.status(400).send({ message: "Cliente descontado" });
    }

    const { token, user } = await authenticateUseCase.execute({
      email,
      password,
      type,
      ip: request.ip,
      agent: request.headers["user-agent"] ?? "not-identified",
    });

    return response
      .status(201)
      .send({ token, user: UserPresenter.toHttp(user) });
  } catch (error) {
    next(error);
  }
}
