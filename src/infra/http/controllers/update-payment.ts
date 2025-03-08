// Libraries
import Joi from "joi";
import { Request, Response, NextFunction } from "express";

// Use-cases
import { UpdatePaymentUseCase } from "@/core/use-cases/update-payment";

// Container
import container from "@/infra/container";

// Validation
import { parse } from "@/infra/http/validation/parse";

// Entities
import { Payment } from "@/core/entities/payment";

export const updatePaymentParams = Joi.object({
  payment_id: Joi.string().uuid().required(),
});

export const updatePaymentSchema = Joi.object({
  status: Joi.string()
    .valid(...Payment.statuses)
    .optional(),
  method: Joi.string()
    .valid(...Payment.methods)
    .optional(),
  flag: Joi.string()
    .valid(...Payment.flags)
    .optional(),
})
  .required()
  .messages({
    "object.missing": "Pelo menos um campo deve ser fornecido.",
  });

export async function updatePaymentController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { payment_id } = parse(updatePaymentParams, request.params);

    const { status, method, flag } = parse(updatePaymentSchema, request.body);

    const updatePaymentUseCase = container.resolve<UpdatePaymentUseCase>(
      "updatePaymentUseCase"
    );

    await updatePaymentUseCase.execute({
      payment_id,
      status,
      method,
      flag,
    });

    return response.status(204).send();
  } catch (error) {
    next(error);
  }
}
