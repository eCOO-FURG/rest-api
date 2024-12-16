// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { RegisterProductUseCase } from "@/core/use-cases/register-product";

// Container
import container from "@/infra/container";

// Validation
export const registerProductSchema = {
  body: z.object({
    name: z.string(),
    image: z.any(),
    pricing: z.enum(["UNIT", "WEIGHT"]),
  }),
};

export async function registerProductController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, image, pricing } = registerProductSchema.body.parse(
      request.body
    );

    const registerProductUseCase =
      container.resolve<RegisterProductUseCase>("registerProductUseCase");

    await registerProductUseCase.execute({
      user_id: request.user_id,
      name,
      image,
      pricing,
    });

    return response.sendStatus(201);
  } catch (error) {
    next(error);
  }
}