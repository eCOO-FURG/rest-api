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

export const listCatalogsQuery = Joi.object({
  cycle_id: Joi.string().uuid().required(),
  page: Joi.number().required().min(1),
  product: Joi.string().optional(),
  category_id: Joi.string().uuid().optional(),
});

export async function listCatalogsController(request: Request, response: Response, next: NextFunction) {
  try {
    const { cycle_id, page, product, category_id } = parse(listCatalogsQuery, request.query);

    const listCatalogsUseCase = container.resolve<ListCatalogsUseCase>("listCatalogsUseCase");

    const { catalogs } = await listCatalogsUseCase.execute({
      cycle_id,
      page,
      product,
      category_id,
    });

    return response.status(200).send(catalogs.map((catalog) => CatalogPresenter.toHttp(catalog)));
  } catch (error) {
    next(error);
  }
}
