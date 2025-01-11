// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { RegisterProductUseCase } from "@/core/use-cases/register-product";

// Container
import container from "@/infra/container";

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
    const files = request.files as Record<string, Express.Multer.File[]>;

    const content = { ...request.body, image: files?.image?.at(0)?.buffer };

    const { name, pricing, image } = registerProductSchema.body.parse(content);

    const registerProductUseCase = container.resolve<RegisterProductUseCase>(
      "registerProductUseCase"
    );

    await registerProductUseCase.execute({
      name,
      pricing,
      image,
    });

    return response.sendStatus(201);
  } catch (error) {
    next(error);
  }
}
