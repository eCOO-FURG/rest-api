// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { RegisterOrderUseCase } from "@/core/use-cases/register-order";

// Container
import container from "@/infra/container";

// Presenters
import { BagPresenter } from "@/infra/http/presenters/bag-presenter";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const registerOrderSchema = Joi.object({
  user_id: Joi.string().uuid().when("$admin", {
    is: true,
    then: Joi.optional(),
    otherwise: Joi.forbidden(),
  }),
  comment: Joi.string().optional().max(50),
  cycle_id: Joi.string().uuid().optional(),
  market_id: Joi.string().uuid().optional(),
  address: Joi.object({
    street: Joi.string().required(),
    number: Joi.string().required(),
    neighborhood: Joi.string().required(),
    postal_code: Joi.string().required(),
    complement: Joi.string().optional(),
  }),
  orders: Joi.array()
    .items(
      Joi.object({
        offer_id: Joi.string().uuid().required(),
        amount: Joi.number().required(),
      }),
    )
    .min(1)
    .required(),
}).xor("cycle_id", "market_id");

export async function registerOrderController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { user_id, cycle_id, market_id, address, orders, comment } = parse(
      registerOrderSchema,
      request.body,
      { context: { admin: request.admin } },
    );

    const registerOrderUseCase = container.resolve<RegisterOrderUseCase>("registerOrderUseCase");

    const { bag } = await registerOrderUseCase.execute({
      user_id: request.admin ? user_id : request.user_id,
      cycle_id,
      market_id,
      residence: address,
      items: orders,
      comment,
    });

    return response.status(201).send(BagPresenter.toHttp(bag));
  } catch (error) {
    next(error);
  }
}
