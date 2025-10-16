// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { RegisterMarketUseCase } from "@/core/use-cases/register-market";

// Container
import container from "@/infra/container";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const registerMarketSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().max(200),
});

export async function registerMarketController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { name, description } = parse(registerMarketSchema, request.body);

    const registerMarketUseCase = container.resolve<RegisterMarketUseCase>("registerMarketUseCase");

    await registerMarketUseCase.execute({
      name,
      description,
    });

    return response.sendStatus(201);
  } catch (error) {
    next(error);
  }
}
