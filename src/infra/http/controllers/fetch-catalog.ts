// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Use-cases
import { FetchCatalogUseCase } from "@/core/use-cases/fetch-catalog";

// Presenters
import { CatalogPresenter } from "@/infra/http/presenters/catalog-presenter";

// Utils
import { toBoolean } from "@/infra/utils/to-boolean";
import { toDate } from "@/infra/utils/to-date";

// Validation
import { parse } from "@/infra/http/validation/parse";
import { boolean } from "@/infra/http/validation/boolean";

export const fetchCatalogParams = Joi.object({
  catalog_id: Joi.string().uuid().required(),
});

export const fetchCatalogQuery = Joi.object({
  page: Joi.number().integer().min(1).required(),
  product: Joi.string().optional(),
  available: boolean.optional(),
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

    const fetchCatalogUsecase = container.resolve<FetchCatalogUseCase>(
      "fetchCatalogUseCase",
    );

    const { catalog } = await fetchCatalogUsecase.execute({
      catalog_id,
      page,
      product,
      remaining: toBoolean(remaining),
      available: toBoolean(available),
      since: toDate(since),
      before: toDate(before),
    });

    return response.status(200).send(CatalogPresenter.toHttp(catalog));
  } catch (error) {
    next(error);
  }
}
