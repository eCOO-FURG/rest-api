// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Use-cases
import { UpdateProductUseCase } from "@/core/use-cases/update-product";

// Container
import container from "@/infra/container";

// Validation
import { parse } from "@/infra/http/validation/parse";

// Utils
import { toFile } from "@/infra/utils/to-file";

// Validation
import { file } from "@/infra/http/validation/file";

// Entities
import { Product } from "@/core/entities/product";

// Validation
import { boolean } from "@/infra/http/validation/boolean";

// Utils
import { toBoolean } from "@/infra/utils/to-boolean";

export const updateProductParams = Joi.object({
  product_id: Joi.string().uuid().required(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  image: file.optional(),
  pricing: Joi.string()
    .valid(...Product.pricings)
    .optional(),
  category_id: Joi.string().uuid().optional(),
  perishable: boolean.optional(),
  archived: boolean.optional(),
});

export async function updateProductController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { product_id } = parse(updateProductParams, request.params);

    const { name, pricing, archived, image, category_id, perishable } = parse(
      updateProductSchema,
      request.body
    );

    const updateProductUseCase = container.resolve<UpdateProductUseCase>(
      "updateProductUseCase"
    );

    await updateProductUseCase.execute({
      product_id,
      name,
      pricing,
      category_id,
      archived: toBoolean(archived),
      perishable: toBoolean(perishable),
      image: toFile(image),
    });

    return response.sendStatus(200);
  } catch (error) {
    next(error);
  }
}
