// Libraries
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Container
import container from "@/infra/container";

// Use-cases
import { FetchBagUseCase } from "@/core/use-cases/fetch-bag";

// Presenters
import { BagPresenter } from "@/infra/http/presenters/bag-presenter";

// Entities
import { Order } from "@/core/entities/order";

// Utils
import { toArray } from "@/infra/utils/to-array";

// Validation
import { options } from "@/infra/http/validation/options";
import { parse } from "@/infra/http/validation/parse";

export const fetchBagParams = Joi.object({
  bag_id: Joi.string().uuid().required(),
});

export const fetchBagQuery = Joi.object({
  page: Joi.number().integer().min(1).required(),
  statuses: options(Order.statuses).optional(),
});

export async function fetchBagController(request: Request, response: Response, next: NextFunction) {
  try {
    const { bag_id } = parse(fetchBagParams, request.params);
    const { page, statuses } = parse(fetchBagQuery, request.query);

    const fetchBagUseCase = container.resolve<FetchBagUseCase>("fetchBagUseCase");

    const { bag } = await fetchBagUseCase.execute({
      bag_id,
      user_id: request.user_id,
      page,
      statuses: toArray(statuses),
    });

    return response.status(200).send(BagPresenter.toHttp(bag));
  } catch (error) {
    next(error);
  }
}
