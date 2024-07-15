// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { OrderProductsUseCase } from "@/core/use-cases/order-products";

// Container
import container from "@/infra/container";

const orderProductsSchema = {
  body: z.object({
    offer_id: z.string(),
    amount: z.coerce.number()
  })
}

export async function orderProductsController(request: Request, response: Response, next: NextFunction){
  try{
    const { offer_id, amount } = orderProductsSchema.body.parse(request.body)

    const orderProductsUsecase = container.resolve<OrderProductsUseCase>(
      'orderPoductsUseCase'
    )

    await orderProductsUsecase.execute({
      user_id: request.user_id,
      offer_id,
      amount
    })

    return response.sendStatus(201)
  } catch(error){
    next(error)
  }
}