// Libraries
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { CreateOfferUseCase } from "@/core/use-cases/create-offer";

// Container
import container from "@/infra/container";

// Validation
import { notEmpty } from "@/infra/http/validation/not-empty";
import { toDate } from "@/infra/utils/to-date";
import { notPast } from "@/infra/http/validation/not-past";

export const createOfferSchema = {
  body: z
    .object({
      product_id: z.string(),
      cycle_id: z.string(),
      amount: z.coerce.number(),
      price: z.coerce.number(),
      description: z.string().optional(),
      expires_at: z
        .string()
        .regex(/^\d{2}-\d{2}-\d{4}$/, "Formato esperado: DD-MM-YYYY")
        .optional()
        .refine(notPast.validation, notPast.warning),
    })
    .refine(notEmpty.validation, notEmpty.warning),
};

export async function createOfferController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { product_id, cycle_id, amount, price, description, expires_at } =
      createOfferSchema.body.parse(request.body);

    const createOfferUseCase =
      container.resolve<CreateOfferUseCase>("createOfferUseCase");

    await createOfferUseCase.execute({
      farm_id: request.farm_id,
      product_id,
      cycle_id,
      amount,
      price,
      description,
      expires_at: toDate(expires_at),
    });

    return response.sendStatus(201);
  } catch (error) {
    next(error);
  }
}
