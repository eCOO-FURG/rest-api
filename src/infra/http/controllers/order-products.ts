// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { OrderProductsUseCase } from "@/core/use-cases/order-products";

// Container
import container from "@/infra/container";

const orderProductsSchema = {
  body: z.object({
    cycle_id: z.string(),
    address: z.string(),
    order: z
      .array(
        z.object({
          offer_id: z.string(),
          amount: z.number().min(1),
        })
      )
      .refine((products) => !products.length, {
        message: "Pelo menos um pedido deve ser feito.",
      }),
  }),
};

export async function orderProductsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, address, order } = orderProductsSchema.body.parse(
      request.body
    );

    const orderProductsUseCase = container.resolve<OrderProductsUseCase>(
      "orderPoductsUseCase"
    );

    await orderProductsUseCase.execute({
      user_id: request.user_id,
      cycle_id,
      address,
      request: order,
    });

    return response.sendStatus(201);
  } catch (error) {
    next(error);
  }
}
