// Libraries
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { RegisterProductUseCase } from "@/core/use-cases/register-product";

// Container
import container from "@/infra/container";

// Utils
import { toFile } from "@/infra/utils/to-file";

export const registerProductSchema = {
  body: z.object({
    name: z.string(),
    pricing: z.enum(["UNIT", "WEIGHT"]),
    image: z.custom<Express.Multer.File>(),
  }),
};

export async function registerProductController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, pricing, image } = registerProductSchema.body.parse(
      request.body
    );

    const registerProductUseCase = container.resolve<RegisterProductUseCase>(
      "registerProductUseCase"
    );

    await registerProductUseCase.execute({
      name,
      pricing,
      image: toFile(image),
    });

    return response.sendStatus(201);
  } catch (error) {
    next(error);
  }
}
