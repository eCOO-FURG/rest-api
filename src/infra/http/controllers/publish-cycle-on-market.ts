// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { PublishCycleOnMarketUseCase } from "@/core/use-cases/publish-cycle-on-market";

// Container
import container from "@/infra/container";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const publishCycleOnMarketSchema = Joi.object({
  market_id: Joi.string().uuid().required(),
  cycle_id: Joi.string().uuid().required(),
});

export async function publishCycleOnMarketController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { market_id, cycle_id } = parse(publishCycleOnMarketSchema, request.body);

    const publishCycleOnMarketUseCase = container.resolve<PublishCycleOnMarketUseCase>(
      "publishCycleOnMarketUseCase",
    );

    await publishCycleOnMarketUseCase.execute({
      market_id,
      cycle_id,
    });

    return response.sendStatus(201);
  } catch (error) {
    next(error);
  }
}
