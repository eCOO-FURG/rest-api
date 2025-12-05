// Libraries
import Joi from "joi";
import { Request, Response, NextFunction } from "express";

// Container
import container from "@/infra/container";

// Use-cases
import { UpdateOfferUseCase } from "@/core/use-cases/update-offer";

// Validation
import { parse } from "@/infra/http/validation/parse";
import { boolean } from "@/infra/http/validation/boolean";

// Utils
import { toBoolean } from "@/infra/utils/to-boolean";
import { toDate } from "@/infra/utils/to-date";
export const updateOfferParams = Joi.object({
  offer_id: Joi.string().uuid().required(),
});

export const updateOfferSchema = Joi.object({
  amount: Joi.number().optional(),
  price: Joi.number().optional(),
  description: Joi.string().optional(),
  comment: Joi.string().optional(),
  active: boolean.optional(),
  expires_at: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
});

export async function updateOfferController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { offer_id } = parse(updateOfferParams, request.params);

    const { amount, price, description, active, expires_at, comment } = parse(
      updateOfferSchema,
      request.body,
    );

    const updateOfferUseCase = container.resolve<UpdateOfferUseCase>("updateOfferUseCase");

    await updateOfferUseCase.execute({
      user_id: request.user_id,
      farm_id: request.farm_id,
      offer_id,
      amount,
      price,
      description,
      comment,
      active: toBoolean(active),
      expires_at: toDate(expires_at),
    });

    return response.status(204).send();
  } catch (error) {
    next(error);
  }
}
