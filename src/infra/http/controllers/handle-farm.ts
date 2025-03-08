// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Use-cases
import { UpdateFarmUseCase } from "@/core/use-cases/update-farm";

// Entities
import { Farm } from "@/core/entities/farm";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const handleFarmParams = Joi.object({
  farm_id: Joi.string().uuid().required(),
});

export const handleFarmSchema = Joi.object({
  status: Joi.string()
    .valid(...Farm.statuses)
    .optional(),
})
  .required()
  .messages({
    "object.missing": "Pelo menos um campo deve ser fornecido.",
  });

export async function handleFarmController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { farm_id } = parse(handleFarmParams, request.params);
    const { status } = parse(handleFarmSchema, request.body);

    const updateFarmUseCase =
      container.resolve<UpdateFarmUseCase>("updateFarmUseCase");

    await updateFarmUseCase.execute({
      farm_id,
      status,
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
