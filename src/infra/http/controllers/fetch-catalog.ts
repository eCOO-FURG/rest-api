// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { FetchCatalogUseCase } from "@/core/use-cases/fetch-catalog";
import { CatalogPresenter } from "@/infra/http/presenters/catalog-presenter";
import { OfferPresenter } from "@/infra/http/presenters/offer-presenter";

// Presenters

const fetchCatalogsSchema = {
  query: z.object({
    page: z.coerce.number(),
    product: z.string().optional(),
  }),
  params: z.object({
    catalog_id: z.string().uuid(),
  }),
};

export async function fetchCatalogController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { catalog_id } = fetchCatalogsSchema.params.parse(request.params);
    const { page, product } = fetchCatalogsSchema.query.parse(request.query);

    const fetchCatalogUsecase = container.resolve<FetchCatalogUseCase>(
      "fetchCatalogUseCase"
    );

    const { catalog } = await fetchCatalogUsecase.execute({
      catalog_id,
      page,
      product,
    });

    return response.status(200).send({
      ...CatalogPresenter.toHttp(catalog),
      offers: catalog.offers.map((offer) => OfferPresenter.toHttp(offer)),
    });
  } catch (error) {
    next(error);
  }
}
