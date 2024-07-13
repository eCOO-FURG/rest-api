// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { HandleOrdersDeliveryUseCase } from "@/core/use-cases/handle-orders-delivery";

const checkfarmdeliverySchema = {
  body: z.object({
    cycle_id: z.string().uuid(),
    farm_id: z.string().uuid(),
    status: z.enum(["RECEIVED", "CANCELLED"]),
  }),
};

export async function handleOrdersDeliveryController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, farm_id, status } = checkfarmdeliverySchema.body.parse(
      request.body
    );

    const checkfarmdeliveryUseCase =
      container.resolve<HandleOrdersDeliveryUseCase>(
        "handleOrdersDeliveryUseCase"
      );

    await checkfarmdeliveryUseCase.execute({
      cycle_id,
      farm_id,
      status,
    });

    return response.sendStatus(200);
  } catch (error) {
    next(error);
  }
}
