// Libraries
import Joi from "joi";
import { Request, Response, NextFunction } from "express";

// Use-cases
import { FetchLastCatalogUseCase } from "@/core/use-cases/fetch-last-catalog";

// Container
import container from "@/infra/container";

// Presenters
import { CatalogPresenter } from "@/infra/http/presenters/catalog-presenter";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const fetchLastCatalogQuery = Joi.object({
  cycle_id: Joi.string().uuid().required(),
  page: Joi.number().required(),
});

export async function fetchLastCatalogController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { page, cycle_id } = parse(fetchLastCatalogQuery, request.query);

    const fetchLastCatalogUseCase = container.resolve<FetchLastCatalogUseCase>(
      "fetchLastCatalogUseCase"
    );

    const { catalog } = await fetchLastCatalogUseCase.execute({
      farm_id: request.farm_id,
      cycle_id,
      page,
    });

    return response.status(200).send(CatalogPresenter.toHttp(catalog));
  } catch (error) {
    next(error);
  }
}
