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
  bag_id: Joi.string().uuid().optional(),
  cycle_id: Joi.string().required(),
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
        offer_id: Joi.string().required(),
        amount: Joi.number().required(),
      })
    )
    .min(1)
    .required(),
});

export async function registerOrderController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, address, orders, bag_id } = parse(
      registerOrderSchema,
      request.body
    );

    const registerOrderUseCase = container.resolve<RegisterOrderUseCase>(
      "registerOrderUseCase"
    );

    const { bag } = await registerOrderUseCase.execute({
      bag_id,
      user_id: request.user_id,
      cycle_id,
      address,
      request: orders,
    });

    return response.status(200).send(BagPresenter.toHttp(bag));
  } catch (error) {
    next(error);
  }
}
