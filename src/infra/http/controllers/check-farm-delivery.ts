import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { CheckFarmDeliveryUseCase } from "@/core/use-cases/check-farm-delivery";

import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { MissingOfferDeliveryStatusError } from "@/core/errors/missing-offer-delivery-status";

import container from "@/infra/container";

const checkfarmdeliverySchema = {
  body: z.object({
    cycle_id: z.string().uuid(),
    farm_id: z.string().uuid(),
    offers_fulfillment: z.record(
      z.union([
        z.literal("complete"),
        z.literal("cancelled"),
        z.literal("pending"),
      ])
    ),
  }),
};

export class CheckFarmDeliveryController {
  static async handle(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { cycle_id, farm_id, offers_fulfillment } =
        checkfarmdeliverySchema.body.parse(request.body);

      const checkfarmdeliveryUseCase =
        container.resolve<CheckFarmDeliveryUseCase>("checkFarmDeliveryUseCase");

      await checkfarmdeliveryUseCase.execute({
        cycle_id,
        farm_id,
        offers_fulfillment,
      });

      return response.sendStatus(200);
    } catch (error) {
      if (error instanceof ResourceNotFoundError)
        return response.sendStatus(404);

      if (error instanceof MissingOfferDeliveryStatusError)
        return response.sendStatus(400);

      next(error);
    }
  }
}
