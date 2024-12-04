// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { CreateOfferUseCase } from "@/core/use-cases/create-offer";

// Container
import container from "@/infra/container";

export const offerProductsSchema = {
  body: z.object({
    product_id: z.string(),
    cycle_id: z.string(),
    amount: z.coerce.number(),
    price: z.coerce.number(),
    description: z.string().optional(),
  }),
};

export async function offerProductsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { product_id, cycle_id, amount, price, description } =
      offerProductsSchema.body.parse(request.body);

    const createOfferUseCase =
      container.resolve<CreateOfferUseCase>("createOfferUseCase");

    await createOfferUseCase.execute({
      farm_id: request.farm_id,
      product_id,
      cycle_id,
      amount,
      price,
      description,
    });

    return response.sendStatus(201);
  } catch (error) {
    next(error);
  }
}
