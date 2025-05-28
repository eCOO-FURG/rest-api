// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Use-cases
import { FetchCycleCatalogUseCase } from "@/core/use-cases/fetch-cycle-catalog";

// Presenters
import { CatalogPresenter } from "@/infra/http/presenters/catalog-presenter";

// Utils
import { toBoolean } from "@/infra/utils/to-boolean";
import { toDate } from "@/infra/utils/to-date";

// Validation
import { parse } from "@/infra/http/validation/parse";
import { boolean } from "@/infra/http/validation/boolean";

export const fetchCycleCatalogParams = Joi.object({
  cycle_id: Joi.string().uuid().required(),
});

export const fetchCycleCatalogQuery = Joi.object({
  page: Joi.number().integer().min(1).required(),
  product: Joi.string().optional(),
  available: boolean.optional(),
  since: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
  before: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
});

export async function fetchCycleCatalogController(request: Request, response: Response, next: NextFunction) {
  try {
    const { cycle_id } = parse(fetchCycleCatalogParams, request.params);
    const { page, product, available, since, before } = parse(fetchCycleCatalogQuery, request.query);

    const fetchCycleCatalogUsecase = container.resolve<FetchCycleCatalogUseCase>("fetchCycleCatalogUseCase");

    const { catalog } = await fetchCycleCatalogUsecase.execute({
      cycle_id,
      farm_id: request.farm_id,
      page,
      product,
      available: toBoolean(available),
      since: toDate(since),
      before: toDate(before),
    });

    return response.status(200).send(CatalogPresenter.toHttp(catalog));
  } catch (error) {
    next(error);
  }
}
