// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Use-cases
import { FetchBagUseCase } from "@/core/use-cases/fetch-bag";

// Presenters
import { BagAndDetailsPresenter } from "@/infra/http/presenters/bag-presenter";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const fetchBagParams = Joi.object({
  bag_id: Joi.string().uuid().required(),
});

export const fetchBagQuery = Joi.object({
  page: Joi.number().integer().min(1).required(),
});

export async function fetchBagController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { bag_id } = parse(fetchBagParams, request.params);
    const { page } = parse(fetchBagQuery, request.query);

    const fetchBagUseCase =
      container.resolve<FetchBagUseCase>("fetchBagUseCase");

    const { bag } = await fetchBagUseCase.execute({
      bag_id,
      user_id: request.user_id,
      page,
    });

    return response.status(200).send(BagAndDetailsPresenter.toHttp(bag));
  } catch (error) {
    next(error);
  }
}
