// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { UpdateBoxUseCase } from "@/core/use-cases/update-box";

// Validations
import { notEmpty } from "@/infra/http/validation/not-empty";

export const handleBoxSchema = {
  route: z.object({
    box_id: z.string().uuid(),
  }),
  body: z.object({
    orders: z
      .array(
        z.object({
          id: z.string().uuid(),
          status: z.enum(["RECEIVED", "CANCELLED"]),
        })
      )
      .refine(notEmpty.validation, notEmpty.warning),
  }),
};

export async function handleBoxController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { box_id } = handleBoxSchema.route.parse(request.params);

    const { orders } = handleBoxSchema.body.parse(request.body);

    const updateBoxUseCase =
      container.resolve<UpdateBoxUseCase>("updateBoxUseCase");

    await updateBoxUseCase.execute({
      box_id,
      orders,
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
