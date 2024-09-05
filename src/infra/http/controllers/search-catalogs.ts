// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { SearchCatalogsUseCase } from "@/core/use-cases/search-catalogs";

// Container
import container from "@/infra/container";

// Presenters
import { CatalogPresenter } from "@/infra/http/presenters/catalog-presenter";

const searchCatalogsSchema = {
  query: z.object({
    cycle_id: z.string(),
    page: z.coerce.number(),
    product: z.string().optional(),
  }),
};

export async function searchCatalogsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, page, product } = searchCatalogsSchema.query.parse(
      request.query
    );

    const searchCatalogsUseCase = container.resolve<SearchCatalogsUseCase>(
      "searchCatalogsUseCase"
    );

    const { catalogs } = await searchCatalogsUseCase.execute({
      cycle_id,
      product,
      page,
    });

    return response
      .status(200)
      .send(catalogs.map((catalog) => CatalogPresenter.toHttp(catalog)));
  } catch (error) {
    next(error);
  }
}
