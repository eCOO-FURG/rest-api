// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { RegisterPaymentUseCase } from "@/core/use-cases/register-payment";

// Container
import container from "@/infra/container";

export const registerPaymentSchema = {
  route: z.object({
    bag_id: z.string(),
  }),
  body: z
    .object({
      method: z
        .enum(["CREDIT", "DEBIT", "CASH", "PIX"])
        .openapi({ type: "string" }),
      flag: z
        .enum(["MASTERCARD", "VISA", "OTHER"])
        .optional()
        .openapi({ type: "string" }),
    })
    .refine(
      ({ method, flag }) => {
        if (method && ["CREDIT", "DEBIT"].includes(method)) {
          return !!flag;
        }
        return true;
      },
      {
        message: "Flag is required when method is CREDIT or DEBIT",
        path: ["flag"],
      }
    ),
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

    const { bag_id } = registerPaymentSchema.route.parse(request.params);
    const { method, flag } = registerPaymentSchema.body.parse(request.body);

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
