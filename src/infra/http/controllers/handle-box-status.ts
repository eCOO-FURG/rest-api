// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { HandleBoxStatusUseCase } from "@/core/use-cases/handle-box-status";

export const handleBoxStatusSchema = {
  route: z.object({
    box_id: z.string().uuid(),
  }),
  body: z.object({
    status: z.enum(["RECEIVED", "CANCELLED"]),
  }),
};

export async function handleBoxStatusController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { box_id } = handleBoxStatusSchema.route.parse(request.params);

    const { status } = handleBoxStatusSchema.body.parse(request.body);

    const handleBoxStatusUseCase = container.resolve<HandleBoxStatusUseCase>(
      "handleBoxStatusUseCase"
    );

    await handleBoxStatusUseCase.execute({
      box_id,
      status,
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
