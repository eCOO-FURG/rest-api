// Libraries
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { UpdateBagUseCase } from "@/core/use-cases/update-bag";

// Validation
import { notEmpty } from "@/infra/http/validation/not-empty";

export const updateBagSchema = {
  route: z.object({
    bag_id: z.string().uuid(),
  }),
  body: z
    .object({
      status: z.enum(["CANCELLED"]).optional(),
    })
    .refine(notEmpty.validation, notEmpty.warning),
};

export async function updateBagController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { bag_id } = updateBagSchema.route.parse(req.params);
    const { status } = updateBagSchema.body.parse(req.body);

    const updateBagUseCase =
      container.resolve<UpdateBagUseCase>("updateBagUseCase");

    await updateBagUseCase.execute({ bag_id, user_id: req.user_id, status });

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
