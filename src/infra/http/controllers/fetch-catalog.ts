// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Use-cases
import { FetchCatalogUseCase } from "@/core/use-cases/fetch-catalog";

// Presenters
import { FarmPresenter } from "@/infra/http/presenters/farm-presenter";

// Utils
import { toBoolean } from "@/infra/utils/to-boolean";
import { toDate } from "@/infra/utils/to-date";

// Validation
import { parse } from "@/infra/http/validation/parse";
import { boolean } from "@/infra/http/validation/boolean";

// Entities
import { Bag } from "@/core/entities/bag";

export const fetchCatalogParams = Joi.object({
  catalog_id: Joi.string().uuid().required(),
});

export const fetchCatalogQuery = Joi.object({
  page: Joi.number().integer().min(1).required(),
  product: Joi.string().optional(),
  available: Joi.string()
    .valid(...Bag.sources, "false", "CYCLE_WITH_SCHEDULED")
    .optional(),
  remaining: boolean.optional(),
  since: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
  before: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
    .optional(),
});

export async function fetchCatalogController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { catalog_id } = parse(fetchCatalogParams, request.params);

    const { page, product, remaining, available, since, before } = parse(
      fetchCatalogQuery,
      request.query,
    );

    const fetchCatalogUsecase = container.resolve<FetchCatalogUseCase>("fetchCatalogUseCase");

    const { catalog } = await fetchCatalogUsecase.execute({
      farm_id: catalog_id,
      page,
      product,
      available: available === "false" ? false : available,
      remaining: toBoolean(remaining),
      since: toDate(since),
      before: toDate(before),
    });

    return response.status(200).send(FarmPresenter.toHttp(catalog));
  } catch (error) {
    next(error);
  }
}
