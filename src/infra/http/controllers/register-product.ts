// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { RegisterProductUseCase } from "@/core/use-cases/register-product";

// Container
import container from "@/infra/container";

// Utils
import { toJSON } from "@/infra/utils/to-json";

export const registerProductSchema = {
  body: z.object({
    name: z.string(),
    pricing: z.enum(["UNIT", "WEIGHT"]),
    image: z.any().refine((value) => !!value),
  }),
};

export async function registerProductController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const content = toJSON({ ...request.body, image: request.file });

    const { name, pricing } = registerProductSchema.body.parse(content);

    const registerProductUseCase = container.resolve<RegisterProductUseCase>(
      "registerProductUseCase"
    );

    await registerProductUseCase.execute({
      name,
      pricing,
      image: request.file!.buffer,
    });

    return response.sendStatus(201);
  } catch (error) {
    next(error);
  }
}
