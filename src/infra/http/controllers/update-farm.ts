// Use-cases
import { UpdateFarmUseCase } from "@/core/use-cases/update-farm";

// Container
import container from "@/infra/container";

// Libs
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const updateFarmSchema = {
  route: z.object({
    farm_id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().optional(),
    counterfoil_number: z.string().optional(),
    description: z.string().optional()
  }),
};

export async function updateFarmController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, counterfoil_number, description } =
      updateFarmSchema.body.parse(request.body);

    const { farm_id } = updateFarmSchema.route.parse(request.params);

    const updateFarmUseCase =
      container.resolve<UpdateFarmUseCase>("updateFarmUseCase");

    await updateFarmUseCase.execute({
      farm_id: farm_id,
      name,
      counterfoil_number,
      description
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
