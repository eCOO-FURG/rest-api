// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Use-cases
import { FetchCurrentBoxUseCase } from "@/core/use-cases/fetch-current-box";

// Presenters
import { BoxPresenter } from "@/infra/http/presenters/box-presenter";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const fetchCurrentBoxQuery = Joi.object({
  cycle_id: Joi.string().uuid().required(),
  page: Joi.number().integer().min(1).required(),
});

export async function fetchCurrentBoxController(request: Request, response: Response, next: NextFunction) {
  try {
    const { cycle_id, page } = parse(fetchCurrentBoxQuery, request.query);

    const fetchCurrentBoxUsecase = container.resolve<FetchCurrentBoxUseCase>("fetchCurrentBoxUseCase");

    const { box } = await fetchCurrentBoxUsecase.execute({
      farm_id: request.farm_id,
      cycle_id,
      page,
    });

    return response.status(200).send(BoxPresenter.toHttp(box));
  } catch (error) {
    next(error);
  }
}
