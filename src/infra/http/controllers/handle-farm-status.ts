// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { UpdateFarmUseCase } from "@/core/use-cases/update-farm";

export const handleFarmStatusSchema = {
  route: z.object({
    farm_id: z.string().uuid(),
  }),
  body: z.object({
    status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]).openapi({
      description: "Status de uma fazenda. ACTIVE, INACTIVE ou PENDING.",
    }),
  }),
};

export async function handleFarmStatusController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { farm_id } = handleFarmStatusSchema.route.parse(request.params);

    const { status } = handleFarmStatusSchema.body.parse(request.body);

    const updateFarmUseCase =
      container.resolve<UpdateFarmUseCase>("updateFarmUseCase");

    await updateFarmUseCase.execute({
      farm_id,
      status,
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
