// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { OrderProductsUseCase } from "@/core/use-cases/order-products";

// Container
import container from "@/infra/container";

// Presenters
import { BagPresenter } from "@/infra/http/presenters/bag-presenter";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const orderProductsSchema = Joi.object({
  bag_id: Joi.string().uuid().optional(),
  cycle_id: Joi.string().required(),
  address: Joi.object({
    street: Joi.string().required(),
    number: Joi.string().required(),
    neighborhood: Joi.string().required(),
    complement: Joi.string().optional(),
    postal_code: Joi.string().required(),
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
})
  .required()
  .messages({
    "object.missing": "Pelo menos um campo deve ser fornecido.",
  });

export async function orderProductsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, address, orders, bag_id } = parse(
      orderProductsSchema,
      request.body
    );

    const orderProductsUseCase = container.resolve<OrderProductsUseCase>(
      "orderPoductsUseCase"
    );

    const { bag } = await orderProductsUseCase.execute({
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
