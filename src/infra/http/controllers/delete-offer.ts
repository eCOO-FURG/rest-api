// Libraries
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { DeleteOfferUseCase } from "@/core/use-cases/delete-offer";

// Container
import container from "@/infra/container";

export const deleteOfferSchema = {
  body: z
    .object({
      cycle_id: z.string(),
      offer_id: z.string()
    })
};

export async function deleteOfferController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, offer_id } =
    deleteOfferSchema.body.parse(request.body);

    const deleteOfferUseCase =
      container.resolve<DeleteOfferUseCase>("deleteOfferUseCase");

    await deleteOfferUseCase.execute({
      farm_id: request.farm_id,
      cycle_id,
      offer_id
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
