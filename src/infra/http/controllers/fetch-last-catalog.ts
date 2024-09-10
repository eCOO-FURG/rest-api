// Use-cases
import { FetchLastCatalogUseCase } from '@/core/use-cases/fetch-last-catalog';

// Container
import container from "@/infra/container";

// Libs
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Presenters
import { OfferPresenter } from "@/infra/http/presenters/offer-presenter";

const fetchLastCatalogSchema = {
  params: z.object({
    cycle_id: z.string().uuid(),
  }),
};

export async function fetchLastCatalogController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id } = fetchLastCatalogSchema.params.parse(request.params);

    const farm_id = request.farm_id;


    const fetchLastCatalogUseCase =
      container.resolve<FetchLastCatalogUseCase>("fetchLastCatalogUseCase");


    const { catalog } = await fetchLastCatalogUseCase.execute({
      cycle_id,
      farm_id,
    });
    

    return response
      .status(200)
      .send(catalog.offers.map((offer) => OfferPresenter.toHttp(offer)));

  } catch (error) {
    next(error);
  }
}