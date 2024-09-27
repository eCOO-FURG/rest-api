// Use-cases
import { UpdateOfferUseCase } from "@/core/use-cases/update-offer";

// Container
import container from "@/infra/container";

// Libs
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const updateOfferSchema = {
  body: z.object({
    amount: z.number(),
    price: z.number(),
    description: z.string().optional(),
  }),
  params: z.object({
    offer_id: z.string(),
  }),
};

export async function updateOfferController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { amount, price, description } = updateOfferSchema.body.parse(request.body);
    const { offer_id } = updateOfferSchema.params.parse(request.params);

    const updateOfferUsecase =
      container.resolve<UpdateOfferUseCase>("updateOfferUseCase");

    await updateOfferUsecase.execute({
      farm_id: request.farm_id,
      offer_id,
      amount,
      price,
      description,
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
