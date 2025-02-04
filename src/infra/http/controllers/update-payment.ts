// Libraries
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Use-cases
import { UpdatePaymentUseCase } from "@/core/use-cases/update-payment";

// Container
import container from "@/infra/container";

// Validation
import { notEmpty } from "@/infra/http/validation/not-empty";

export const updatePaymentSchema = {
  params: z.object({
    payment_id: z.string().uuid(),
  }),
  body: z
    .object({
      status: z
        .enum(["PENDING", "DONE", "REFUNDED"])
        .optional()
        .openapi({ type: "string" }),
      method: z.enum(["CREDIT", "DEBIT", "CASH", "PIX"]).optional().openapi({
        type: "string",
      }),
      flag: z.enum(["VISA", "MASTERCARD", "OTHER"]).optional().openapi({
        type: "string",
      }),
    })
    .refine(notEmpty.validation, notEmpty.warning),
};

export async function updatePaymentController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { payment_id } = updatePaymentSchema.params.parse(request.params);

    const { status, method, flag } = updatePaymentSchema.body.parse(
      request.body
    );

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
