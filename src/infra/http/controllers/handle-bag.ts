// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { HandleBagUseCase } from "@/core/use-cases/handle-bag";

const handleBagSchema = {
  body: z.object({
    status: z.enum(["PENDING", "SEPARATED", "DISPATCHED"]),
  }),
  params: z.object({
    bag_id: z.string().uuid(),
  }),
};

export async function handleBagController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { status } = handleBagSchema.body.parse(request.body);
    const { bag_id } = handleBagSchema.params.parse(request.params);

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
