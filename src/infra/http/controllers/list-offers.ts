// Use-cases
import { ListOffersUseCase } from '@/core/use-cases/list-offers';

// Container
import container from "@/infra/container";

// Libs
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Presenters
import { OfferPresenter } from "@/infra/http/presenters/offer-presenter";

const listOffersSchema = {
  params: z.object({
    cycle_id: z.string().uuid(),
  }),
};

export async function listOffersController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id } = listOffersSchema.params.parse(request.params);

    const admin_id = request.farm_id;


    const listOffersUseCase =
      container.resolve<ListOffersUseCase>("listOffersUseCase");


    const { offers } = await listOffersUseCase.execute({
      cycle_id,
      admin_id,
    });
    

    return response
      .status(200)
      .send(offers.map((offer) => OfferPresenter.toHttp(offer)));

  } catch (error) {
    next(error);
  }
}