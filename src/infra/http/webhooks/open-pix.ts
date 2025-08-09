// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Use-cases
import { UpdatePaymentUseCase } from "@/core/use-cases/update-payment";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const openPixSchema = Joi.object({
  event: Joi.string()
    .valid("OPENPIX:CHARGE_COMPLETED", "OPENPIX:CHARGE_EXPIRED")
    .required(),
  charge: Joi.object({
    correlationID: Joi.string().required(),
  }).required(),
});

export const openPixWebhookListener = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { event, charge } = parse(openPixSchema, request.body);

    const updatePaymentUseCase = container.resolve<UpdatePaymentUseCase>(
      "updatePaymentUseCase",
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
