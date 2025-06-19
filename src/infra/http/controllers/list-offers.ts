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
import { parse } from "@/infra/http/validation/parse";
import { boolean } from "@/infra/http/validation/boolean";
import { toBoolean } from "@/infra/utils/to-boolean";

export const listAvailableOffersQuery = Joi.object({
  page: Joi.number().required().min(1),
  cycle_id: Joi.string().uuid().optional(),
  product: Joi.string().optional(),
  category_id: Joi.string().uuid().optional(),
  available: boolean.optional(),
});

export async function listAvailableOffersController(request: Request, response: Response, next: NextFunction) {
  try {
    const { cycle_id, page, product, category_id, available } = parse(listAvailableOffersQuery, request.query);

    const listAvailableOffersUseCase = container.resolve<ListOffersUseCase>("listAvailableOffersUseCase");

    const { offers } = await listAvailableOffersUseCase.execute({
      cycle_id,
      page,
      product,
      category_id,
      available: toBoolean(available),
    });

    return response.status(200).send(offers.map(OfferPresenter.toHttp));
  } catch (error) {
    next(error);
  }
}
