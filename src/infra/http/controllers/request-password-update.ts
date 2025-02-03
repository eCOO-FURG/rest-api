// Libraries
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { RequestPasswordUpdateUseCase } from "@/core/use-cases/request-password-update";

// Container
import container from "@/infra/container";

// Validation
import { notEmpty } from "@/infra/http/validation/not-empty";

export const requestPasswordUpdateSchema = {
  body: z
    .object({ email: z.string() })
    .refine(notEmpty.validation, notEmpty.warning),
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

    return response.sendStatus(200);
  } catch (error) {
    next(error);
  }
}
