// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { OrderProductsUseCase } from "@/core/use-cases/order-products";

// Container
import container from "@/infra/container";

// Presenters
import { BagPresenter } from "@/infra/http/presenters/bag-presenter";

export const orderProductsSchema = {
  body: z.object({
    bag_id: z.string().optional(),
    cycle_id: z.string(),
    address: z
      .object({
        street: z.string(),
        number: z.string(),
        neighborhood: z.string(),
        complement: z.string().optional(),
        postal_code: z.string(),
      })
      .optional(),
    orders: z
      .array(
        z.object({
          offer_id: z.string(),
          amount: z.number(),
        })
      )
      .refine((products) => products.length, {
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
    const { cycle_id, address, orders, bag_id } =
      orderProductsSchema.body.parse(request.body);

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
