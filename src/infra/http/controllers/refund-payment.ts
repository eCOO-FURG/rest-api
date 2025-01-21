// Libs
import { z } from "zod";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { RefundPaymentUseCase } from "@/core/use-cases/refund-payment";

// Container
import container from "@/infra/container";

// Presenters
import { PaymentPresenter } from "@/infra/http/presenters/payment-presenter";

export const refundPaymentSchema = {
  route: z.object({
    bag_id: z.string().uuid(),
  }),
};

export async function refundPaymentController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { bag_id } = refundPaymentSchema.route.parse(request.params);

    const refundPaymentUseCase = container.resolve<RefundPaymentUseCase>(
      "refundPaymentUseCase"
    );

    const { payment, refund } = await refundPaymentUseCase.execute({ bag_id });

    return response.status(200).send({
      payment: PaymentPresenter.toHttp(payment),
      refund,
    });
  } catch (error) {
    next(error);
  }
}
