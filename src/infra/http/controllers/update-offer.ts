// Libraries
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { UpdateOfferUseCase } from "@/core/use-cases/update-offer";

// Container
import container from "@/infra/container";

// Validation
import { notEmpty } from "@/infra/http/validation/not-empty";
import { toDate } from "@/infra/utils/to-date";
import { notPast } from "@/infra/http/validation/not-past";

export const updateOfferSchema = {
  body: z
    .object({
      cycle_id: z.string(),
      offer_id: z.string(),
      amount: z.coerce.number().optional(),
      price: z.coerce.number().optional(),
      description: z.string().optional(),
      expires_at: z
        .string()
        .regex(/^\d{2}-\d{2}-\d{4}$/, "Formato esperado: DD-MM-YYYY")
        .optional()
        .refine(notPast.validation, notPast.warning),
    })
    .refine(notEmpty.validation, notEmpty.warning),
};

export async function updateOfferController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, offer_id, amount, price, description, expires_at } =
      updateOfferSchema.body.parse(request.body);

    const updateOfferUseCase =
      container.resolve<UpdateOfferUseCase>("updateOfferUseCase");

    await updateOfferUseCase.execute({
      farm_id: request.farm_id,
      cycle_id,
      offer_id,
      amount,
      price,
      description,
      expires_at: toDate(expires_at),
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
