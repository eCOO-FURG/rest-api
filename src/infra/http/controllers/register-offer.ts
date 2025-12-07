// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { RegisterOfferUseCase } from "@/core/use-cases/register-offer";

// Container
import container from "@/infra/container";

// Validation
import { parse } from "@/infra/http/validation/parse";
import { boolean } from "@/infra/http/validation/boolean";

// Utils
import { toDate } from "@/infra/utils/to-date";
import { toBoolean } from "@/infra/utils/to-boolean";

export const registerOfferSchema = Joi.object({
  product_id: Joi.string().required(),
  cycle_id: Joi.string().uuid().optional(),
  market_id: Joi.string().uuid().optional(),
  farm_id: Joi.string().uuid().when("$admin", {
    is: true,
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  amount: Joi.number().required(),
  price: Joi.number().required(),
  recurring: boolean.optional(),
  description: Joi.string().optional(),
  expires_at: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
  comment: Joi.string().optional(),
}).xor("cycle_id", "market_id");

export async function registerOfferController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const {
      product_id,
      cycle_id,
      farm_id,
      market_id,
      amount,
      price,
      description,
      recurring,
      expires_at,
      comment,
    } = parse(registerOfferSchema, request.body, { context: { admin: request.admin } });

    const registerOfferUseCase = container.resolve<RegisterOfferUseCase>("registerOfferUseCase");

    await registerOfferUseCase.execute({
      farm_id: request.farm_id ?? farm_id,
      product_id,
      cycle_id,
      market_id,
      amount,
      price,
      description,
      recurring: toBoolean(recurring),
      expires_at: toDate(expires_at),
      comment,
    });

    return response.sendStatus(201);
  } catch (error) {
    next(error);
  }
}
