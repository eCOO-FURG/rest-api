// Use-cases
import { UpdateUserUseCase } from "@/core/use-cases/update-user";

// Container
import container from "@/infra/container";

// Libs
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const updateFarmSchema = {
  body: z.object({
    name: z.string().optional(),
    counterfoil_number: z.string().optional(),
    description: z.string().email().optional()
  }),
};

export async function updateUserController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, counterfoil_number, description } =
      updateFarmSchema.body.parse(request.body);

    const updateUserUsecase =
      container.resolve<UpdateUserUseCase>("updateUserUseCase");

    await updateUserUsecase.execute({
      user_id: request.user_id,
      first_name,
      last_name,
      cpf,
      email,
      password,
      phone,
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
