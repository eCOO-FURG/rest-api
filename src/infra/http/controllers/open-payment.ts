// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { OpenPaymentUseCase } from "@/core/use-cases/open-payment";

// Container
import container from "@/infra/container";

// Presenters
import { PaymentPresenter } from "@/infra/http/presenters/payment-presenter";

export const openPaymentSchema = { body: z.object({ bag_id: z.string() }) };

export async function openPaymentController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { bag_id } = openPaymentSchema.body.parse(request.body);

    const openPaymentUseCase =
      container.resolve<OpenPaymentUseCase>("openPaymentUseCase");

    const { aggregate, charge } = await openPaymentUseCase.execute({ bag_id });

    return response.status(200).send({
      payment: PaymentPresenter.toHttp(aggregate),
      charge,
    });
  } catch (error) {
    next(error);
  }
}
