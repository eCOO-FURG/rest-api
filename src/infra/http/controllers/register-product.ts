// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Entities
import { Product } from "@/core/entities/product";

// Use-cases
import { RegisterProductUseCase } from "@/core/use-cases/register-product";

// Container
import container from "@/infra/container";

// Validation
import { parse } from "@/infra/http/validation/parse";
import { file } from "@/infra/http/validation/file";

// Utils
import { toFile } from "@/infra/utils/to-file";

export const registerProductSchema = Joi.object({
  name: Joi.string().required(),
  pricing: Joi.string()
    .valid(...Product.pricings)
    .required(),
  image: file.required(),
  category_id: Joi.string().required(),
  perishable: Joi.boolean().required(),
});

export async function registerProductController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, pricing, image, category_id, perishable } = parse(
      registerProductSchema,
      request.body
    );

    const registerProductUseCase = container.resolve<RegisterProductUseCase>(
      "registerProductUseCase"
    );

    await registerProductUseCase.execute({
      name,
      pricing,
      image: toFile(image),
      category_id,
      perishable,
    });

    return response.sendStatus(201);
  } catch (error) {
    next(error);
  }
}
