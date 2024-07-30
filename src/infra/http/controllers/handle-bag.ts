// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { HandleBagUseCase } from "@/core/use-cases/handle-bag";

const handleBagSchema = {
  body: z.object({
    bag_id: z.string().uuid(),
    status: z.enum(["PENDING", "SEPARATED", "DISPATCHED"]),
  }),
};

export async function handleBagController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { bag_id, status } = handleBagSchema.body.parse(request.body);

    const handleBagUseCase =
      container.resolve<HandleBagUseCase>("handleBagUseCase");

    await handleBagUseCase.execute({
      bag_id,
      status,
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
