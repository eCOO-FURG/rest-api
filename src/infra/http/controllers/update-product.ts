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
  params: z.object({
    product_id: z.string().uuid(),
  }),
  body: z
    .object({
      name: z.string().optional(),
      image: z.custom<Buffer>().optional(),
      pricing: z.enum(["UNIT", "WEIGHT"]).optional(),
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
    const files = request.files as Record<string, Express.Multer.File[]>;

    const { product_id } = updateProductSchema.params.parse(request.params);

    const content = { ...request.body, image: files?.image?.at(0)?.buffer };

    const { name, pricing, archived, image } =
      updateProductSchema.body.parse(content);

    const updateProductUseCase = container.resolve<UpdateProductUseCase>(
      "updateProductUseCase"
    );

    await updateProductUseCase.execute({
      product_id,
      name,
      pricing,
      archived,
      image,
    });

    return response.sendStatus(200);
  } catch (error) {
    next(error);
  }
}
