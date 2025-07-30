// Libraries
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Container
import container from "@/infra/container";

// Use-cases
import { UpdateOrderUseCase } from "@/core/use-cases/update-order";

// Validation
import { parse } from "@/infra/http/validation/parse";

// Entities
import { Order } from "@/core/entities/order";

export const updateOrderParams = Joi.object({
  order_id: Joi.string().uuid().required(),
});

export const updateOrderSchema = Joi.object({
  status: Joi.string()
    .valid(...Order.statuses)
    .required(),
});

export async function updateOrderController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { order_id } = parse(updateOrderParams, request.params);

    const { status } = parse(updateOrderSchema, request.body);

    const updateOrderUseCase =
      container.resolve<UpdateOrderUseCase>("updateOrderUseCase");

    await updateOrderUseCase.execute({
      user_id: request.user_id,
      order_id,
      status,
    });

    return response.status(204).send();
  } catch (error) {
    next(error);
  }
}
