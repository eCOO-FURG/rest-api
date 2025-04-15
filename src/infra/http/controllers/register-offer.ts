// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { RegisterOfferUseCase } from "@/core/use-cases/register-offer";

// Container
import container from "@/infra/container";

// Validation
import { parse } from "@/infra/http/validation/parse";

// Utils
import { toDate } from "@/infra/utils/to-date";

export const registerOfferSchema = Joi.object({
  product_id: Joi.string().required(),
  cycle_id: Joi.string().required(),
  amount: Joi.number().required(),
  price: Joi.number().required(),
  description: Joi.string().optional(),
  expires_at: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
});

export async function registerOfferController(request: Request, response: Response, next: NextFunction) {
  try {
    const { product_id, cycle_id, amount, price, description, expires_at } = parse(registerOfferSchema, request.body);

    const registerOfferUseCase = container.resolve<RegisterOfferUseCase>("registerOfferUseCase");

    await registerOfferUseCase.execute({
      farm_id: request.farm_id,
      product_id,
      cycle_id,
      amount,
      price,
      description,
      expires_at: toDate(expires_at),
    });

    return response.sendStatus(201);
  } catch (error) {
    next(error);
  }
}
