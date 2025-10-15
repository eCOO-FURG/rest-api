// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Utils
import { toBoolean } from "@/infra/utils/to-boolean";

// Container
import container from "@/infra/container";

// Validation
import { parse } from "@/infra/http/validation/parse";
import { boolean } from "@/infra/http/validation/boolean";

// Use-cases
import { UpdateMarketUseCase } from "@/core/use-cases/update-market";

export const updateMarketParams = Joi.object({
  market_id: Joi.string().uuid().required(),
});

export const updateMarketSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  open: boolean.optional(),
});
export async function updateMarketController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { market_id } = parse(updateMarketParams, request.params);
    const { name, description, open } = parse(updateMarketSchema, request.body);

    const updateMarketUseCase = container.resolve<UpdateMarketUseCase>("updateMarketUseCase");

    await updateMarketUseCase.execute({
      market_id,
      name,
      description,
      open: toBoolean(open),
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
