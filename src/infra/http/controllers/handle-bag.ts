// Libraries
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { UpdateBagUseCase } from "@/core/use-cases/update-bag";

// Validation
import { notEmpty } from "@/infra/http/validation/not-empty";

export const handleBagSchema = {
  route: z.object({
    bag_id: z.string().uuid(),
  }),
  body: z
    .object({
      status: z
        .enum([
          "PENDING",
          "SEPARATED",
          "DISPATCHED",
          "RECEIVED",
          "CANCELLED",
          "DEFERRED",
        ])
        .openapi({ type: "string" })
        .optional(),
    })
    .refine(notEmpty.validation, notEmpty.warning),
};

export async function handleBagController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { bag_id } = handleBagSchema.route.parse(request.params);
    const { status } = handleBagSchema.body.parse(request.body);

    const updateBagUseCase =
      container.resolve<UpdateBagUseCase>("updateBagUseCase");

    await updateBagUseCase.execute({
      bag_id,
      user_id: request.user_id,
      status,
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
