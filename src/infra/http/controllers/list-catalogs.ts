// Libraries
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Use-cases
import { ListCatalogsUseCase } from "@/core/use-cases/list-catalogs";

// Container
import container from "@/infra/container";

// Presenters
import { FarmPresenter } from "@/infra/http/presenters/farm-presenter";

// Validation
import { parse } from "@/infra/http/validation/parse";
import { boolean } from "@/infra/http/validation/boolean";

// Utils
import { toBoolean } from "@/infra/utils/to-boolean";
import { toDate } from "@/infra/utils/to-date";

export const listCatalogsQuery = Joi.object({
  page: Joi.number().required().min(1),
  cycle_id: Joi.string().uuid().optional(),
  market_id: Joi.string().uuid().optional(),
  farm_id: Joi.string().uuid().optional(),
  product: Joi.string().optional(),
  category_id: Joi.string().uuid().optional(),
  available: boolean.optional(),
  remaining: boolean.optional(),
  since: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
  before: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
});

export async function listCatalogsController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const {
      cycle_id,
      market_id,
      farm_id,
      page,
      product,
      category_id,
      available,
      remaining,
      since,
      before,
    } = parse(listCatalogsQuery, request.query);

    const listCatalogsUseCase = container.resolve<ListCatalogsUseCase>("listCatalogsUseCase");

    const { catalogs } = await listCatalogsUseCase.execute({
      cycle_id,
      market_id,
      farm_id,
      page,
      product,
      category_id,
      available: toBoolean(available),
      remaining: toBoolean(remaining),
      since: toDate(since),
      before: toDate(before),
    });

    return response.status(200).send(catalogs.map((catalog) => FarmPresenter.toHttp(catalog)));
  } catch (error) {
    next(error);
  }
}
