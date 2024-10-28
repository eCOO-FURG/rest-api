// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { UpdatePaymentUseCase } from "@/core/use-cases/update-payment";

export const updatePaymentSchema = {
  params: z.object({
    payment_id: z.string().uuid(),
  }),
  body: z
    .object({
      status: z
        .enum(["PENDING", "DONE", "FAILED"])
        .optional()
        .openapi({ type: "string" }),
      method: z.enum(["CREDIT", "DEBIT", "CASH", "PIX"]).optional().openapi({
        type: "string",
      }),
      flag: z.enum(["VISA", "MASTERCARD", "OTHER"]).optional().openapi({
        type: "string",
      }),
    })
    .refine(
      ({ method, flag }) => {
        if (method && ["CREDIT", "DEBIT"].includes(method)) return !!flag;
        return true;
      },
      {
        message: "Flag is required when method is CREDIT or DEBIT",
        path: ["flag"],
      }
    ),
};

export async function updatePaymentController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const updatePaymentUseCase = container.resolve<UpdatePaymentUseCase>(
      "updatePaymentUseCase"
    );

    const { payment_id } = updatePaymentSchema.params.parse(request.params);

    const { status, method, flag } = updatePaymentSchema.body.parse(
      request.body
    );

    await updatePaymentUseCase.execute({
      payment_id,
      status,
      method,
      flag,
    });

    return response.status(200).send();
  } catch (error) {
    next(error);
  }
}
