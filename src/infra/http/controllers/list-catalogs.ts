// Libraries
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { ListCatalogsUseCase } from "@/core/use-cases/list-catalogs";

// Container
import container from "@/infra/container";

// Presenters
import { CatalogPresenter } from "@/infra/http/presenters/catalog-presenter";

export const listCatalogsSchema = {
  query: z.object({
    cycle_id: z.string().openapi({ description: "O ciclo da busca." }),
    page: z.coerce.number().openapi({ description: "A página da listagem." }),
    product: z
      .string()
      .optional()
      .openapi({ description: "Filtro por nome de produto." }),
  }),
};

export async function listCatalogsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, page, product } = listCatalogsSchema.query.parse(
      request.query
    );

    const listCatalogsUseCase = container.resolve<ListCatalogsUseCase>(
      "listCatalogsUseCase"
    );

    const { catalogs } = await listCatalogsUseCase.execute({
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
