// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { RequestPasswordUpdateUseCase } from "@/core/use-cases/request-password-update";

// Container
import container from "@/infra/container";

export const requestPasswordUpdateSchema = {
  body: z.object({ email: z.string() }),
};

export async function requestPasswordUpdateController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { email } = requestPasswordUpdateSchema.body.parse(request.body);

    container.resolve("onUpdatePasswordRequestEvent");

    const requestPasswordUpdateUseCase =
      container.resolve<RequestPasswordUpdateUseCase>(
        "requestPasswordUpdateUseCase"
      );

    await requestPasswordUpdateUseCase.execute({
      email,
    });

    return response.sendStatus(201);
  } catch (error) {
    next(error);
  }
}
