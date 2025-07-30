//Libs
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Use-cases
import { FetchFarmUseCase } from "@/core/use-cases/fetch-farm";

// Presenters
import { FarmPresenter } from "@/infra/http/presenters/farm-presenter";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const fetchFarmParams = Joi.object({
  farm_id: Joi.string().uuid().required(),
});

export async function fetchFarmController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { farm_id } = parse(fetchFarmParams, request.params);

    const fetchUserFarmUseCase =
      container.resolve<FetchFarmUseCase>("fetchFarmUseCase");

    const { farm } = await fetchUserFarmUseCase.execute({
      farm_id,
    });

    return response.status(200).send(FarmPresenter.toHttp(farm));
  } catch (error) {
    next(error);
  }
}
