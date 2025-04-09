// Libraries
import Joi from "joi";
import { NextFunction, Request, Response } from "express";

// Container
import container from "@/infra/container";

// Use-cases
import { FetchCategoryUseCase } from "@/core/use-cases/fetch-category";

// Validation
import { parse } from "@/infra/http/validation/parse";

// Presenters
import { CategoryPresenter } from "@/infra/http/presenters/category-presenter";

export const fetchCategoryParams = Joi.object({
  category_id: Joi.string().uuid().required(),
});

export const fetchCategoryQuery = Joi.object({
  page: Joi.number().required().min(1),
  cycle_id: Joi.string().uuid().optional(),
});

export async function fetchCategoryController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { category_id } = parse(fetchCategoryParams, request.params);

    const { page, cycle_id } = parse(fetchCategoryQuery, request.query);

    const fetchCategoryUseCase = container.resolve<FetchCategoryUseCase>(
      "fetchCategoryUseCase"
    );

    const { category } = await fetchCategoryUseCase.execute({
      id: category_id,
      page,
      cycle_id,
    });

    return response.status(200).send(CategoryPresenter.toHttp(category));
  } catch (error) {
    next(error);
  }
}
