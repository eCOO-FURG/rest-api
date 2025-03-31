// Libs
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Use-cases
import { ListCategoriesUseCase } from "@/core/use-cases/list-categories";

// Presenters
import { CategoryPresenter } from "@/infra/http/presenters/category-presenter";

// Validation
import { parse } from "@/infra/http/validation/parse";

export const listCategoriesQuery = Joi.object({
  page: Joi.number().required().min(1),
  name: Joi.string().optional(),
  cycle_id: Joi.string().uuid().optional(),
});

export async function listCategoriesController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { page, name, cycle_id } = parse(listCategoriesQuery, request.query);

    const listCategoriesUseCase = container.resolve<ListCategoriesUseCase>(
      "listCategoriesUseCase"
    );

    const { categories } = await listCategoriesUseCase.execute({
      name,
      page,
      cycle_id,
    });

    return response
      .status(200)
      .send(categories.map((category) => CategoryPresenter.toHttp(category)));
  } catch (error) {
    next(error);
  }
}
