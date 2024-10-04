// Use-cases
import { FetchCurrentCatalogUseCase } from "@/core/use-cases/fetch-current-catalog";

// Container
import container from "@/infra/container";

// Libs
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Presenters
import { CatalogPresenter } from "@/infra/http/presenters/catalog-presenter";
import { OfferPresenter } from "@/infra/http/presenters/offer-presenter";

export const fetchCurrentCatalogSchema = {
  route: z.object({ cycle_id: z.string().uuid() }),
  query: z.object({
    page: z.coerce
      .number()
      .openapi({ description: "Página das ofertas do catálogo." }),
  }),
};

export async function fetchCurrentCatalogController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id } = fetchCurrentCatalogSchema.route.parse(request.params);

    const farm_id = request.farm_id;

    const { page } = fetchCurrentCatalogSchema.query.parse(request.query);

    const fetchCurrentCatalogUseCase =
      container.resolve<FetchCurrentCatalogUseCase>(
        "fetchCurrentCatalogUseCase"
      );

    const { catalog } = await fetchCurrentCatalogUseCase.execute({
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
