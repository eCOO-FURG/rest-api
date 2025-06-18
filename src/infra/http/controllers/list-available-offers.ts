// Libraries
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Use-cases
import { ListAvailableOffersUseCase } from "@/core/use-cases/list-available-offers";

// Container
import container from "@/infra/container";

// Presenters
import { OfferPresenter } from "@/infra/http/presenters/offer-presenter";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const listAvailableOffersQuery = Joi.object({
  page: Joi.number().required().min(1),
  cycle_id: Joi.string().uuid().optional(),
  product: Joi.string().optional(),
  category_id: Joi.string().uuid().optional(),
});

export async function listAvailableOffersController(request: Request, response: Response, next: NextFunction) {
  try {
    const { cycle_id, page, product, category_id } = parse(listAvailableOffersQuery, request.query);

    const listAvailableOffersUseCase = container.resolve<ListAvailableOffersUseCase>("listAvailableOffersUseCase");

    const { offers } = await listAvailableOffersUseCase.execute({
      cycle_id,
      page,
      product,
      category_id,
    });

    return response.status(200).send(offers.map((offer) => OfferPresenter.toHttp(offer)));
  } catch (error) {
    next(error);
  }
}
