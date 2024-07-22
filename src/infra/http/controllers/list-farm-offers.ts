// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { ListFarmOffersUseCase } from "@/core/use-cases/list-farm-offers";

// Presenters
import { OfferCompletePresenter } from "@/infra/http/presenters/offer-complete-presenter";
import { FarmPresenter } from "@/infra/http/presenters/farm-presenter";

const listFarmOffersSchema = {
  query: z.object({
    cycle_id: z.string().uuid(),
    page: z.coerce.number(),
    product: z.string().optional(),
  }),
  params: z.object({
    farm_id: z.string().uuid(),
  }),
};

export async function listFarmOffersController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { farm_id } = listFarmOffersSchema.params.parse(request.params);
    const { cycle_id, page, product } = listFarmOffersSchema.query.parse(
      request.query
    );

    const listFarmOffersUseCase = container.resolve<ListFarmOffersUseCase>(
      "listFarmOffersUseCase"
    );

    const { farm, offers } = await listFarmOffersUseCase.execute({
      cycle_id,
      farm_id,
      page,
      product,
    });

    return response
      .status(200)
      .send({
        ...FarmPresenter.toHttp(farm),
        offers: offers.map((offer) => OfferCompletePresenter.toHttp(offer)),
      });

    return response.status(200).send();
  } catch (error) {
    next(error);
  }
}
