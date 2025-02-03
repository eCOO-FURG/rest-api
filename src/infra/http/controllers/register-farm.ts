// Libraries
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { RegisterFarmUseCase } from "@/core/use-cases/register-farm";

// Container
import container from "@/infra/container";

// Validation
import { notEmpty } from "@/infra/http/validation/not-empty";

export const registerFarmSchema = {
  body: z
    .object({
      name: z.string(),
      tally: z.string(),
    })
    .refine(notEmpty.validation, notEmpty.warning),
};

export const registerFarmController = [
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { name, tally } = registerFarmSchema.body.parse(request.body);

      const registerFarmUseCase = container.resolve<RegisterFarmUseCase>(
        "registerFarmUseCase"
      );

      await registerFarmUseCase.execute({
        user_id: request.user_id,
        tally,
        name,
      });

      return response.sendStatus(201);
    } catch (error) {
      next(error);
    }
  },
];
