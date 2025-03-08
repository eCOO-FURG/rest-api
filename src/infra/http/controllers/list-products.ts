// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Use-cases
import { ListProductsUsecase } from "@/core/use-cases/list-products";

// Presenters
import { ProductPresenter } from "@/infra/http/presenters/product-presenter";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const listProductsQuery = Joi.object({
  page: Joi.number().required(),
  name: Joi.string().optional(),
  category_id: Joi.string().uuid().optional(),
});

export async function listProductsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { page, name, category_id } = parse(listProductsQuery, request.query);

    const listProductsUseCase = container.resolve<ListProductsUsecase>(
      "listProductsUseCase"
    );

    const { products } = await listProductsUseCase.execute({
      name,
      page,
      category_id,
    });

    return response
      .status(200)
      .send(products.map((product) => ProductPresenter.toHttp(product)));
  } catch (error) {
    next(error);
  }
}
