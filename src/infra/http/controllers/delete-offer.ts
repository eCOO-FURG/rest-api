// Libraries
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Container
import container from "@/infra/container";

// Use-cases
import { DeleteOfferUseCase } from "@/core/use-cases/delete-offer";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const deleteOfferParams = Joi.object({
  offer_id: Joi.string().uuid().required(),
});

export async function deleteOfferController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { offer_id } = parse(deleteOfferParams, request.params);

    const deleteOfferUseCase = container.resolve<DeleteOfferUseCase>("deleteOfferUseCase");

    await deleteOfferUseCase.execute({
      farm_id: request.farm_id,
      offer_id,
    });

    return response.status(204).send();
  } catch (error) {
    next(error);
  }
}
