// Libraries
import { z } from "zod";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { UpdateProductUseCase } from "@/core/use-cases/update-product";

// Container
import container from "@/infra/container";

// Validation
import { notEmpty } from "@/infra/http/validation/not-empty";

// Utils
import { toFile } from "@/infra/utils/to-file";

export const updateProductSchema = {
  params: z.object({
    product_id: z.string().uuid(),
  }),
  body: z
    .object({
      name: z.string().optional(),
      image: z.custom<Express.Multer.File>().optional(),
      pricing: z.enum(["UNIT", "WEIGHT"]).optional(),
      category_id: z.string().uuid().optional(),
      archived: z
        .union([
          z.boolean(),
          z.enum(["true", "false"]).transform((val) => val === "true"),
        ])
        .optional(),
    })
    .refine(notEmpty.validation, notEmpty.warning),
};

export async function updateProductController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { product_id } = updateProductSchema.params.parse(request.params);

    const { name, pricing, archived, image, category_id } =
      updateProductSchema.body.parse(request.body);

    const updateProductUseCase = container.resolve<UpdateProductUseCase>(
      "updateProductUseCase"
    );

    await updateProductUseCase.execute({
      product_id,
      name,
      pricing,
      category_id,
      archived,
      image: toFile(image),
    });

    return response.sendStatus(200);
  } catch (error) {
    next(error);
  }
}
