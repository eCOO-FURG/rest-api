// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { RegisterPaymentUseCase } from "@/core/use-cases/register-payment";

// Container
import container from "@/infra/container";

export const registerPaymentSchema = {
  body: z.object({
    bag_id: z.string(),
    method: z
      .enum(["CREDIT", "DEBIT", "CASH", "PIX"])
      .openapi({ type: "string" }),
    status: z.enum(["PENDING", "DONE", "FAILED"]).openapi({ type: "string" }),
  }),
};

export async function registerPaymentController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const registerPaymentUseCase = container.resolve<RegisterPaymentUseCase>(
      "registerPaymentUseCase"
    );

    const { bag_id, method, status } = registerPaymentSchema.body.parse(
      request.body
    );

    await registerPaymentUseCase.execute({
      bag_id,
      method,
      status,
    });

    return response.status(201).send();
  } catch (error) {
    next(error);
  }
}
