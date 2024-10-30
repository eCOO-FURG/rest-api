// Use-cases
import { UpdateFarmUseCase } from "@/core/use-cases/update-farm";

// Container
import container from "@/infra/container";

// Libs
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Validation
import { notEmpty } from "@/infra/http/validation/not-empty";

export const updateFarmSchema = {
  body: z
    .object({
      name: z.string().optional(),
      tally: z.string().optional(),
      description: z.string().optional(),
    })
    .refine(notEmpty.validation, notEmpty.warning),
};

export async function updateFarmController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, tally, description } = updateFarmSchema.body.parse(
      request.body
    );

    const updateFarmUseCase =
      container.resolve<UpdateFarmUseCase>("updateFarmUseCase");

    await updateFarmUseCase.execute({
      farm_id: request.farm_id,
      name,
      tally,
      description,
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
