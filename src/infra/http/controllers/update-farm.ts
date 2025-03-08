// Use-cases
import Joi from "joi";
import { UpdateFarmUseCase } from "@/core/use-cases/update-farm";

// Container
import container from "@/infra/container";

// Libraries
import { Request, Response, NextFunction } from "express";

// Validation
import { parse } from "@/infra/http/validation/parse";

// Utils
import { toFile } from "@/infra/utils/to-file";
import { toArray } from "@/infra/utils/to-array";
import { file } from "@/infra/http/validation/file";

export const updateFarmSchema = Joi.object({
  name: Joi.string().optional(),
  tally: Joi.string().optional(),
  description: Joi.string().optional(),
  photo: file.optional(),
});

export async function updateFarmController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, tally, description, photo } = parse(
      updateFarmSchema,
      request.body
    );

    const updateFarmUseCase =
      container.resolve<UpdateFarmUseCase>("updateFarmUseCase");

    await updateFarmUseCase.execute({
      farm_id: request.farm_id,
      name,
      tally,
      description,
      photo: toFile(photo),
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
