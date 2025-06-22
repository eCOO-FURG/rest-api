// Libraries
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Use-cases
import { ListOffersUseCase } from "@/core/use-cases/list-offers";

// Container
import container from "@/infra/container";

// Presenters
import { OfferPresenter } from "@/infra/http/presenters/offer-presenter";

// Validation
import { boolean } from "@/infra/http/validation/boolean";
import { parse } from "@/infra/http/validation/parse";

// Utils
import { toBoolean } from "@/infra/utils/to-boolean";
import { toDate } from "@/infra/utils/to-date";

export const listOffersQuery = Joi.object({
  page: Joi.number().required().min(1),
  cycle_id: Joi.string().uuid().optional(),
  product: Joi.string().optional(),
  category_id: Joi.string().uuid().optional(),
  available: boolean.optional(),
  since: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
  before: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
});

export async function listOffersController(request: Request, response: Response, next: NextFunction) {
  try {
    const { cycle_id, page, product, category_id, available, since, before } = parse(listOffersQuery, request.query);

    const listOffersUseCase = container.resolve<ListOffersUseCase>("listOffersUseCase");

    const { offers } = await listOffersUseCase.execute({
      cycle_id,
      page,
      product,
      category_id,
      available: toBoolean(available),
      since: toDate(since),
      before: toDate(before),
    });

    return response.status(200).send(offers.map(OfferPresenter.toHttp));
  } catch (error) {
    next(error);
  }
}
