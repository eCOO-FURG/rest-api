// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { RegisterPaymentUseCase } from "@/core/use-cases/register-payment";

// Entities
import { Payment } from "@/core/entities/payment";

// Container
import container from "@/infra/container";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const registerPaymentSchema = Joi.object({
  bag_id: Joi.string().uuid().required(),
  method: Joi.string()
    .valid(...Payment.methods)
    .required(),
  flag: Joi.alternatives().conditional("method", {
    is: Joi.string().valid("CREDIT", "DEBIT"),
    then: Joi.string()
      .valid(...Payment.flags)
      .required(),
    otherwise: Joi.string().optional(),
  }),
});

export async function registerPaymentController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { method, flag, bag_id } = parse(registerPaymentSchema, request.body);

    const registerPaymentUseCase =
      container.resolve<RegisterPaymentUseCase>("registerPaymentUseCase");

    await registerPaymentUseCase.execute({
      bag_id,
      method,
      flag,
    });

    return response.status(201).send();
  } catch (error) {
    next(error);
  }
}
