// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { ResetPasswordUseCase } from "@/core/use-cases/reset-password";

// Container
import container from "@/infra/container";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
})
  .required()
  .messages({
    "object.missing": "Pelo menos um campo deve ser fornecido.",
  });

export async function resetPasswordController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { email } = parse(resetPasswordSchema, request.body);

    const resetPasswordUseCase = container.resolve<ResetPasswordUseCase>(
      "resetPasswordUseCase"
    );

    await resetPasswordUseCase.execute({
      email,
    });

    return response.sendStatus(200);
  } catch (error) {
    next(error);
  }
}
