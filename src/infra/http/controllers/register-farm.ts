// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { RegisterFarmUseCase } from "@/core/use-cases/register-farm";

// Container
import container from "@/infra/container";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const registerFarmSchema = Joi.object({
  name: Joi.string().required(),
  tally: Joi.string().required(),
})
  .required()
  .messages({
    "object.missing": "Pelo menos um campo deve ser fornecido.",
  });

export async function registerFarmController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, tally } = parse(registerFarmSchema, request.body);

    const registerFarmUseCase = container.resolve<RegisterFarmUseCase>(
      "registerFarmUseCase"
    );

    await registerFarmUseCase.execute({
      user_id: request.user_id,
      tally,
      name,
    });

    return response.sendStatus(201);
  } catch (error) {
    next(error);
  }
}
