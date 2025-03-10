// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { OpenPaymentUseCase } from "@/core/use-cases/open-payment";

// Container
import container from "@/infra/container";

// Presenters
import { PaymentPresenter } from "@/infra/http/presenters/payment-presenter";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const openPaymentSchema = Joi.object({
  bag_id: Joi.string().uuid().required(),
})
  .required()
  .messages({
    "object.missing": "Pelo menos um campo deve ser fornecido.",
  });

export async function openPaymentController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { bag_id } = parse(openPaymentSchema, request.body);

    const openPaymentUseCase =
      container.resolve<OpenPaymentUseCase>("openPaymentUseCase");

    const { payment, charge } = await openPaymentUseCase.execute({ bag_id });

    return response.status(200).send({
      payment: PaymentPresenter.toHttp(payment),
      charge,
    });
  } catch (error) {
    next(error);
  }
}
