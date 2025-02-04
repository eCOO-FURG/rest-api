// Use-cases
import { FetchLastCatalogUseCase } from "@/core/use-cases/fetch-last-catalog";

// Container
import container from "@/infra/container";

// Libraries
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Presenters
import { CatalogPresenter } from "@/infra/http/presenters/catalog-presenter";

export const fetchLastCatalogSchema = {
  query: z.object({
    cycle_id: z.string().uuid(),
    page: z.coerce
      .number()
      .openapi({ description: "Página das ofertas do catálogo." }),
  }),
};

export async function fetchLastCatalogController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const farm_id = request.farm_id;

    const { page, cycle_id } = fetchLastCatalogSchema.query.parse(
      request.query
    );

    const fetchLastCatalogUseCase = container.resolve<FetchLastCatalogUseCase>(
      "fetchLastCatalogUseCase"
    );

    const { catalog } = await fetchLastCatalogUseCase.execute({
      cycle_id,
      farm_id,
      page,
    });

    return response.status(200).send(CatalogPresenter.toHttp(catalog));
  } catch (error) {
    next(error);
  }
}
