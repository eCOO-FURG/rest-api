// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { HandleFarmStatusUseCase } from "@/core/use-cases/handle-farm-status";

export const handleFarmStatusSchema = {
  route: z.object({
    farm_id: z.string().uuid(),
  }),
};

export async function handleFarmStatusController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { farm_id } = handleFarmStatusSchema.route.parse(request.params);

    const handleFarmStatusUseCase = container.resolve<HandleFarmStatusUseCase>(
      "handleFarmStatusUseCase"
    );

    await handleFarmStatusUseCase.execute({
      farm_id,
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
