// Use-cases
import { DeleteOfferUseCase } from "@/core/use-cases/delete-offer";

// Container
import container from "@/infra/container";

// Libs
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const deleteOfferSchema = {
  route: z.object({
    offer_id: z.string(),
  }),
};

export async function deleteOfferController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { offer_id } = deleteOfferSchema.route.parse(request.params);

    const deleteOfferUseCase =
      container.resolve<DeleteOfferUseCase>("deleteOfferUseCase");

    await deleteOfferUseCase.execute({
      farm_id: request.farm_id,
      offer_id,
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
