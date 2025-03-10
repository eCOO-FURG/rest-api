// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { CreateOfferUseCase } from "@/core/use-cases/create-offer";

// Container
import container from "@/infra/container";

// Validation
import { parse } from "@/infra/http/validation/parse";

// Utils
import { toDate } from "@/infra/utils/to-date";

export const createOfferSchema = Joi.object({
  product_id: Joi.string().required(),
  cycle_id: Joi.string().required(),
  amount: Joi.number().required(),
  price: Joi.number().required(),
  description: Joi.string().optional(),
  expires_at: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Formato esperado: DD-MM-YYYY")
    .optional(),
});

export async function createOfferController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { product_id, cycle_id, amount, price, description, expires_at } =
      parse(createOfferSchema, request.body);

    const createOfferUseCase =
      container.resolve<CreateOfferUseCase>("createOfferUseCase");

    await createOfferUseCase.execute({
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
