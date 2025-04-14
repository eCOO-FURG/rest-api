// Libraries
import Joi from "joi";

// Container
import container from "@/infra/container";

// Use-cases
import { UpdateOfferUseCase } from "@/core/use-cases/update-offer";

// Libraries
import { Request, Response, NextFunction } from "express";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const updateOfferParams = Joi.object({
  offer_id: Joi.string().uuid().required(),
});

export const updateOfferSchema = Joi.object({
  amount: Joi.number().optional(),
  price: Joi.number().optional(),
  description: Joi.string().optional(),
  expires_at: Joi.date().optional(),
});

export async function updateOfferController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { offer_id } = parse(updateOfferParams, request.params);

    const { amount, price, description, expires_at } = parse(
      updateOfferSchema,
      request.body
    );

    const updateOfferUseCase =
      container.resolve<UpdateOfferUseCase>("updateOfferUseCase");

    await updateOfferUseCase.execute({
      farm_id: request.farm_id,
      offer_id,
      amount,
      price,
      description,
      expires_at,
    });

    return response.status(204).send();
  } catch (error) {
    next(error);
  }
}
