// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Use-cases
import { UpdateBagUseCase } from "@/core/use-cases/update-bag";

// Validation
import { parse } from "@/infra/http/validation/parse";
import { Bag } from "@/core/entities/bag";

export const updateBagParams = Joi.object({
  bag_id: Joi.string().uuid().required(),
});

export const updateBagSchema = Joi.object({
  status: Joi.string()
    .valid(...Bag.statuses)
    .optional(),
});

export async function updateBagController(request: Request, response: Response, next: NextFunction) {
  try {
    const { bag_id } = parse(updateBagParams, request.params);
    const { status } = parse(updateBagSchema, request.body);

    const updateBagUseCase = container.resolve<UpdateBagUseCase>("updateBagUseCase");

    await updateBagUseCase.execute({
      user_id: request.user_id,
      bag_id,
      status,
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
