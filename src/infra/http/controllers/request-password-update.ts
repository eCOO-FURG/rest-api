// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { RequestPasswordUpdateUseCase } from "@/core/use-cases/request-password-update";

// Container
import container from "@/infra/container";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const requestPasswordUpdateSchema = Joi.object({
  email: Joi.string().email().required(),
})
  .required()
  .messages({
    "object.missing": "Pelo menos um campo deve ser fornecido.",
  });

export async function requestPasswordUpdateController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { email } = parse(requestPasswordUpdateSchema, request.body);

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
