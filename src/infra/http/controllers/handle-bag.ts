// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { HandleBagUseCase } from "@/core/use-cases/handle-bag";

export const handleBagSchema = {
  route: z.object({
    bag_id: z.string().uuid(),
  }),
  body: z.object({
    status: z
      .enum(["PENDING", "SEPARATED", "DISPATCHED"])
      .openapi({ type: "string" }),
  }),
};

export async function handleBagController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { bag_id } = handleBagSchema.route.parse(request.params);
    const { status } = handleBagSchema.body.parse(request.body);

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
