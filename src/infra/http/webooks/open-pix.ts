// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { UpdatePaymentUseCase } from "@/core/use-cases/update-payment";

export const openPixSchema = z.object({
  event: z.enum(["OPENPIX:CHARGE_COMPLETED", "OPENPIX:CHARGE_EXPIRED"]),
  charge: z.object({
    correlationID: z.string(),
  }),
});

export const openPixWebhookListener = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { event, charge } = openPixSchema.parse(request.body);

    const updatePaymentUseCase = container.resolve<UpdatePaymentUseCase>(
      "updatePaymentUseCase"
    );

    const status = event === "OPENPIX:CHARGE_COMPLETED" ? "DONE" : "FAILED";

    await updatePaymentUseCase.execute({
      payment_id: charge.correlationID,
      status,
    });

    return response.status(200).send();
  } catch (error) {
    next(error);
  }
};
