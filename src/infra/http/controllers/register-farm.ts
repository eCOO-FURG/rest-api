// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { RegisterFarmUseCase } from "@/core/use-cases/register-farm";

// Container
import container from "@/infra/container";

const registerFarmSchema = {
  body: z.object({
    name: z.string(),
    caf: z.string(),
  }),
};

export class RegisterFarmController {
  static async handle(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { name, caf } = registerFarmSchema.body.parse(request.body);

      const registerFarmUseCase = container.resolve<RegisterFarmUseCase>(
        "registerFarmUseCase"
      );

      await registerFarmUseCase.execute({
        user_id: request.user_id,
        caf,
        name,
      });

      return response.sendStatus(201);
    } catch (error) {
      next(error);
    }
  }
}
