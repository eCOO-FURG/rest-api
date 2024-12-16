// Libs
import { z } from "zod";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { UpdateProductUseCase } from "@/core/use-cases/update-product";

// Container
import container from "@/infra/container";

// Validation
import { notEmpty } from "@/infra/http/validation/not-empty";

export const updateProductSchema = {
  body: z.object({
    name: z.string().optional(),
    image: z.any().optional(),
    pricing: z.enum(["UNIT", "WEIGHT"]).optional(),
    archived: z.boolean().optional(),
  }).refine(notEmpty.validation, notEmpty.warning),
  params: z.object({
    product_id: z.string(),
  }),
};

export async function updateProductController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, image, pricing, archived } = updateProductSchema.body.parse(
      request.body
    );

    const { product_id } = updateProductSchema.params.parse(request.params);

    const updateProductUseCase =
      container.resolve<UpdateProductUseCase>("updateProductUseCase");

    await updateProductUseCase.execute({
      user_id: request.user_id,
      product_id,
      name,
      image,
      pricing,
      archived,
    });

    return response.sendStatus(200);
  } catch (error) {
    next(error);
  }
}
