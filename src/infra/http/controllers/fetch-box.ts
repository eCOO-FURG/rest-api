// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Use-cases
import { FetchBoxUseCase } from "@/core/use-cases/fetch-box";

// Presenters
import { BoxPresenter } from "@/infra/http/presenters/box-presenter";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const fetchBoxParams = Joi.object({
  box_id: Joi.string().uuid().required(),
});

export const fetchBoxQuery = Joi.object({
  page: Joi.number().integer().min(1).required(),
});

export async function fetchBoxController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { box_id } = parse(fetchBoxParams, request.params);
    const { page } = parse(fetchBoxQuery, request.query);

    const fetchBoxUseCase =
      container.resolve<FetchBoxUseCase>("fetchBoxUseCase");

    const { box } = await fetchBoxUseCase.execute({
      user_id: request.user_id,
      box_id,
      page,
    });

    return response.status(200).send(BoxPresenter.toHttp(box));
  } catch (error) {
    next(error);
  }
}
