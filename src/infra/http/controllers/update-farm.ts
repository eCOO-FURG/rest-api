// Use-cases
import Joi from "joi";
import { UpdateFarmUseCase } from "@/core/use-cases/update-farm";

// Container
import container from "@/infra/container";

// Libraries
import { Request, Response, NextFunction } from "express";

// Validation
import { parse } from "@/infra/http/validation/parse";
import { file } from "@/infra/http/validation/file";

// Utils
import { toFile } from "@/infra/utils/to-file";

// Entities
import { Farm } from "@/core/entities/farm";

export const updateFarmParams = Joi.object({
  farm_id: Joi.string().uuid().required(),
});

export const updateFarmSchema = Joi.object({
  name: Joi.string().optional(),
  tally: Joi.string().optional(),
  description: Joi.string().optional(),
  photo: file.optional(),
  fee: Joi.number().min(0).max(100).optional(),
  status: Joi.string()
    .valid(...Farm.statuses)
    .optional(),
});

export async function updateFarmController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { farm_id } = parse(updateFarmParams, request.params);

    const { name, tally, description, photo, status, fee } = parse(
      updateFarmSchema,
      request.body,
    );

    const updateFarmUseCase =
      container.resolve<UpdateFarmUseCase>("updateFarmUseCase");

    await updateFarmUseCase.execute({
      user_id: request.user_id,
      farm_id,
      name,
      tally,
      description,
      status,
      fee,
      photo: toFile(photo),
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
