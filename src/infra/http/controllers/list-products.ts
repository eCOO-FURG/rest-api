// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { ListProductsUsecase } from "@/core/use-cases/list-products";

// Presenters
import { ProductPresenter } from "@/infra/http/presenters/product-presenter";

export const listProductSchema = {
  query: z.object({
    page: z.coerce.number().openapi({ description: "Página da listagem." }),
    name: z
      .string()
      .optional()
      .openapi({ description: "Filtro do nome do produto." }),
  }),
};

export async function listProductsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { page, name } = listProductSchema.query.parse(request.query);

    const listProductsUseCase = container.resolve<ListProductsUsecase>(
      "listProductsUseCase"
    );

    const { products } = await listProductsUseCase.execute({
      name,
      page,
    });

    return response
      .status(200)
      .send(products.map((product) => ProductPresenter.toHttp(product)));
  } catch (error) {
    next(error);
  }
}
