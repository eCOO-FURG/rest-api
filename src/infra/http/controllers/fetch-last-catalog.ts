// Use-cases
import { FetchLastCatalogUseCase } from "@/core/use-cases/fetch-last-catalog";

// Container
import container from "@/infra/container";

// Libs
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Presenters
import { CatalogPresenter } from "@/infra/http/presenters/catalog-presenter";
import { OfferPresenter } from "@/infra/http/presenters/offer-presenter";

export const fetchLastCatalogSchema = {
  route: z.object({ cycle_id: z.string().uuid() }),
  query: z.object({
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
    const { cycle_id } = fetchLastCatalogSchema.route.parse(request.params);

    const farm_id = request.farm_id;

    const { page } = fetchLastCatalogSchema.query.parse(request.query);

    const fetchLastCatalogUseCase = container.resolve<FetchLastCatalogUseCase>(
      "fetchLastCatalogUseCase"
    );

    const { catalog } = await fetchLastCatalogUseCase.execute({
      cycle_id,
      farm_id,
      page,
    });

    return response.status(200).send({
      ...CatalogPresenter.toHttp(catalog),
      offers: catalog.offers.map((offer) => OfferPresenter.toHttp(offer)),
    });
  } catch (error) {
    next(error);
  }
}
