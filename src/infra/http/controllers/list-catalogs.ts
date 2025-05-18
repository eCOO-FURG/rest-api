// Libraries
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Use-cases
import { ListCatalogsUseCase } from "@/core/use-cases/list-catalogs";

// Container
import container from "@/infra/container";

// Presenters
import { CatalogPresenter } from "@/infra/http/presenters/catalog-presenter";

// Validation
import { parse } from "@/infra/http/validation/parse";
import { boolean } from "@/infra/http/validation/boolean";
import { toBoolean } from "@/infra/utils/to-boolean";

export const listCatalogsQuery = Joi.object({
  page: Joi.number().required().min(1),
  cycle_id: Joi.string().uuid().optional(),
  farm_id: Joi.string().uuid().optional(),
  product: Joi.string().optional(),
  category_id: Joi.string().uuid().optional(),
  available: boolean.optional(),
});

export async function listCatalogsController(request: Request, response: Response, next: NextFunction) {
  try {
    const { cycle_id, farm_id, page, product, category_id, available } = parse(listCatalogsQuery, request.query);

    const listCatalogsUseCase = container.resolve<ListCatalogsUseCase>("listCatalogsUseCase");

    const { catalogs } = await listCatalogsUseCase.execute({
      cycle_id,
      farm_id,
      page,
      product,
      category_id,
      available: toBoolean(available),
    });

    return response.status(200).send(catalogs.map((catalog) => CatalogPresenter.toHttp(catalog)));
  } catch (error) {
    next(error);
  }
}
