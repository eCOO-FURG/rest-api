// Use-cases
import Joi from "joi";
import { FetchCurrentCatalogUseCase } from "@/core/use-cases/fetch-current-catalog";

// Container
import container from "@/infra/container";

// Libraries
import { Request, Response, NextFunction } from "express";

// Presenters
import { CatalogPresenter } from "@/infra/http/presenters/catalog-presenter";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const fetchCurrentCatalogQuery = Joi.object({
  page: Joi.number().integer().min(1).required(),
  cycle_id: Joi.string().uuid().required(),
});

export async function fetchCurrentCatalogController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { page, cycle_id } = parse(fetchCurrentCatalogQuery, request.query);

    const fetchCurrentCatalogUseCase =
      container.resolve<FetchCurrentCatalogUseCase>(
        "fetchCurrentCatalogUseCase"
      );

    const { catalog } = await fetchCurrentCatalogUseCase.execute({
      farm_id: request.farm_id,
      cycle_id,
      page,
    });

    return response.status(200).send(CatalogPresenter.toHttp(catalog));
  } catch (error) {
    next(error);
  }
}
