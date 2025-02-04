// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Container
import container from "@/infra/container";

// Use-cases
import { ListCategoriesUseCase } from "@/core/use-cases/list-categories";

// Presenters
import { CategoryPresenter } from "@/infra/http/presenters/category-presenter";

export const listCategoriesSchema = {
  query: z.object({
    page: z.coerce.number().openapi({ description: "Página da listagem." }),
    name: z
      .string()
      .optional()
      .openapi({ description: "Filtro do nome da categoria." }),
  }),
};

export async function listCategoriesController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { page, name } = listCategoriesSchema.query.parse(request.query);

    const listCategoriesUseCase = container.resolve<ListCategoriesUseCase>(
      "listCategoriesUseCase"
    );

    const { categories } = await listCategoriesUseCase.execute({
      name,
      page,
    });

    return response
      .status(200)
      .send(categories.map((category) => CategoryPresenter.toHttp(category)));
  } catch (error) {
    next(error);
  }
}
