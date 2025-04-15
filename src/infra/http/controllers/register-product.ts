// Libraries
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Entities
import { Product } from "@/core/entities/product";

// Use-cases
import { RegisterProductUseCase } from "@/core/use-cases/register-product";

// Container
import container from "@/infra/container";

// Validation
import { file } from "@/infra/http/validation/file";
import { parse } from "@/infra/http/validation/parse";

// Utils
import { toBoolean } from "@/infra/utils/to-boolean";
import { toFile } from "@/infra/utils/to-file";

// Validation
import { boolean } from "@/infra/http/validation/boolean";

export const registerProductSchema = Joi.object({
  name: Joi.string().required(),
  pricing: Joi.string()
    .valid(...Product.pricings)
    .required(),
  perishable: boolean.required(),
  archived: boolean.required(),
  image: file.required(),
  category_id: Joi.string().required(),
});

export async function registerProductController(request: Request, response: Response, next: NextFunction) {
  try {
    const { name, pricing, perishable, archived, image, category_id } = parse(registerProductSchema, request.body);

    const registerProductUseCase = container.resolve<RegisterProductUseCase>("registerProductUseCase");

    await registerProductUseCase.execute({
      name,
      pricing,
      perishable: toBoolean(perishable),
      archived: toBoolean(archived),
      image: toFile(image),
      category_id,
    });

    return response.sendStatus(201);
  } catch (error) {
    next(error);
  }
}
